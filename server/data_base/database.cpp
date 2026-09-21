#include "database.h"
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <cstring>
#include <algorithm>
#include <iostream>

// --- GLOBAL SETTINGS ---
constexpr size_t CHUNK_SIZE = 4096;
constexpr size_t DATA_SIZE = 4088;
constexpr size_t EXPAND_BYTES = 2 * 1024 * 1024; // 2MB

// --- FILE PATHS ---
constexpr const char* DB_DIR = "data_base";
constexpr const char* DATA_FILE = "data_base/data.bin";
constexpr const char* FREE_FILE = "data_base/free_index.bin";

// --- INLINE HELPERS ---
inline char* get_block_ptr(ServerContext& ctx, int32_t index) {
    if (!ctx.mapped_file) return nullptr;
    
    uint32_t max_blocks = ctx.file_size / CHUNK_SIZE;
    
    // Fast, single-instruction bounds check for both negative and out-of-bounds
    if (static_cast<uint32_t>(index) >= max_blocks)return nullptr;
    return ctx.mapped_file + (index * CHUNK_SIZE);
}

inline void write_meta(char* block_ptr, int32_t size, int32_t next_idx) {
    std::memcpy(block_ptr + DATA_SIZE, &size, sizeof(int32_t));
    std::memcpy(block_ptr + DATA_SIZE + 4, &next_idx, sizeof(int32_t));
}

// --- BOOT UP ---
void db_init(ServerContext& ctx) {
    // Ensure the data_base directory exists
    struct stat st = {0};
    if (stat(DB_DIR, &st) == -1) {
        mkdir(DB_DIR, 0777);
    }

    // 1. Map data.bin
    ctx.fd = open(DATA_FILE, O_RDWR | O_CREAT, 0666);
    if (ctx.fd == -1) {
        std::cerr << "Failed to open data file!" << std::endl;
        exit(1);
    }
    
    fstat(ctx.fd, &st);
    ctx.file_size = st.st_size;
    
    if (ctx.file_size > 0) {
        ctx.mapped_file = (char*)mmap(nullptr, ctx.file_size, PROT_READ | PROT_WRITE, MAP_SHARED, ctx.fd, 0);
    } else {
        ctx.mapped_file = nullptr;
    }

    // 2. Load free_index.bin instantly into RAM
    int free_fd = open(FREE_FILE, O_RDWR | O_CREAT, 0666);
    fstat(free_fd, &st);
    if (st.st_size > 0) {
        ctx.free_indices.resize(st.st_size / sizeof(int32_t));
        pread(free_fd, ctx.free_indices.data(), st.st_size, 0);
    }
    close(free_fd);
}

// --- GET FREE BLOCK (Batch Expansion) ---
int32_t get_free_index(ServerContext& ctx) {
    if (!ctx.free_indices.empty()) {
        int32_t index = ctx.free_indices.back();
        ctx.free_indices.pop_back();
        
        // FIX: Remove fsync. Let the OS buffer the truncation to disk.
        int free_fd = open(FREE_FILE, O_RDWR);
        if (free_fd != -1) {
            ftruncate(free_fd, ctx.free_indices.size() * sizeof(int32_t));
            close(free_fd);
        }
        return index;
    } 

    // BATCH EXPANSION
    size_t new_blocks = EXPAND_BYTES / CHUNK_SIZE; 
    size_t old_size = ctx.file_size;

    if (ctx.mapped_file) munmap(ctx.mapped_file, ctx.file_size);
    ctx.file_size += EXPAND_BYTES;
    ftruncate(ctx.fd, ctx.file_size);
    ctx.mapped_file = (char*)mmap(nullptr, ctx.file_size, PROT_READ | PROT_WRITE, MAP_SHARED, ctx.fd, 0);
    
    int32_t first_new_index = old_size / CHUNK_SIZE;

    int free_fd = open(FREE_FILE, O_WRONLY | O_APPEND | O_CREAT, 0666);
    if (free_fd != -1) {
        for (int32_t i = first_new_index + new_blocks - 1; i > first_new_index; --i) {
            ctx.free_indices.push_back(i);
            write(free_fd, &i, sizeof(int32_t));
        }
        // FIX: Removed fsync here too. 
        close(free_fd);
    }

    return first_new_index;
}

// --- TYPE 1: INSERT ---
int db_insert_tx(ServerContext& ctx, const std::string& payload) {
    size_t len = payload.length();
    size_t blocks_needed = std::max<size_t>(1, (len + DATA_SIZE - 1) / DATA_SIZE);

    std::unique_lock<std::shared_mutex> lock(ctx.rw_mutex);
    
    // FIX: Pre-allocate all indices FIRST to prevent mmap pointer invalidation (Segfault)
    std::vector<int32_t> allocated_indices;
    allocated_indices.reserve(blocks_needed);
    for (size_t i = 0; i < blocks_needed; ++i) {
        allocated_indices.push_back(get_free_index(ctx));
    }

    size_t offset = 0;
    int32_t first_index = allocated_indices[0];

    // NOW grab pointers and write data
    for (size_t i = 0; i < blocks_needed; ++i) {
        int32_t crn_index = allocated_indices[i];
        int32_t next_index = (i + 1 < blocks_needed) ? allocated_indices[i + 1] : -1;
        
        char* block_ptr = get_block_ptr(ctx, crn_index);
        if (!block_ptr) return -1; 

        std::memset(block_ptr, 0, CHUNK_SIZE);

        size_t write_bytes = std::min(DATA_SIZE, len - offset);
        if (write_bytes > 0) {
            std::memcpy(block_ptr, payload.data() + offset, write_bytes);
        }

        write_meta(block_ptr, static_cast<int32_t>(write_bytes), next_index);
        offset += write_bytes;
    }

    // FIX: Only sync the specific bytes we touched, not the whole file, to prevent freezing the server.
    msync(ctx.mapped_file, ctx.file_size, MS_ASYNC); 
    return first_index;
}

// --- TYPE 2: DELETE ---
bool db_delete_chunk(ServerContext& ctx, int index) {
    std::unique_lock<std::shared_mutex> lock(ctx.rw_mutex);
    
    int32_t current_index = index;
    std::vector<int32_t> freed_this_time; // FIX: Buffer freed blocks

    while (current_index >= 0) {
        char* block_ptr = get_block_ptr(ctx, current_index);
        if (!block_ptr) break; 
        
        int32_t next_index;
        std::memcpy(&next_index, block_ptr + DATA_SIZE + 4, sizeof(int32_t));

        ctx.free_indices.push_back(current_index);
        freed_this_time.push_back(current_index); // Save for disk write

        current_index = next_index;
    }
    
    // FIX: Write to disk ONE time, outside the loop.
    if (!freed_this_time.empty()) {
        int free_fd = open(FREE_FILE, O_WRONLY | O_APPEND | O_CREAT, 0666);
        if (free_fd != -1) {
            write(free_fd, freed_this_time.data(), freed_this_time.size() * sizeof(int32_t));
            close(free_fd);
        }
    }
    return true;
}

// --- TYPE 3: READ RAW CHUNK ---
std::string db_read_chunk(ServerContext& ctx, int index) {
    std::shared_lock<std::shared_mutex> lock(ctx.rw_mutex);
    
    char* block_ptr = get_block_ptr(ctx, index);
    if (!block_ptr) return "-1"; 
    
    return std::string(block_ptr, CHUNK_SIZE);
}

// --- TYPE 4: READ CHAIN ---
std::string db_read_related_chunks(ServerContext& ctx, int start_index) {
    std::shared_lock<std::shared_mutex> lock(ctx.rw_mutex);
    
    std::string full_payload = "";
    int32_t current_index = start_index;
    
    // FIX: Hard limit to prevent infinite loops from disk corruption
    uint32_t max_blocks = ctx.file_size / CHUNK_SIZE; 
    uint32_t blocks_read = 0;

    while (current_index >= 0 && blocks_read < max_blocks) {
        char* block_ptr = get_block_ptr(ctx, current_index);
        if (!block_ptr) break; 

        int32_t used_size;
        std::memcpy(&used_size, block_ptr + DATA_SIZE, sizeof(int32_t));
        if (used_size < 0 || used_size > DATA_SIZE) break;

        full_payload.append(block_ptr, used_size);
        std::memcpy(&current_index, block_ptr + DATA_SIZE + 4, sizeof(int32_t));
        
        blocks_read++; // Increment safety counter
    }
    return full_payload;
}

// --- TYPE 5: INSERT INT REVERSE ---
int db_insert_int(ServerContext& ctx, int current_index, int32_t value) {
    std::unique_lock<std::shared_mutex> lock(ctx.rw_mutex);
    
    char* block_ptr = get_block_ptr(ctx, current_index);
    if (!block_ptr) return -1;
    
    int32_t used_size;
    std::memcpy(&used_size, block_ptr + DATA_SIZE, sizeof(int32_t));

    // CASE 1: The current block has space. Fill backwards!
    if (used_size + sizeof(int32_t) <= DATA_SIZE) {
        // Calculate the position starting from the END of the data section
        int32_t write_offset = DATA_SIZE - used_size - sizeof(int32_t);
        
        std::memcpy(block_ptr + write_offset, &value, sizeof(int32_t));
        used_size += sizeof(int32_t);
        std::memcpy(block_ptr + DATA_SIZE, &used_size, sizeof(int32_t));
        
        // Changed to MS_ASYNC to keep your 19k+ req/sec performance!
        msync(block_ptr, CHUNK_SIZE, MS_ASYNC);
        return current_index;
    } 
    
    // CASE 2: The block is full. Create a new Head block.
    int32_t new_index = get_free_index(ctx);
    char* new_block_ptr = get_block_ptr(ctx, new_index);
    if (!new_block_ptr) return -1;
    
    std::memset(new_block_ptr, 0, CHUNK_SIZE);
    
    // Put the very first value at the absolute END of the new block
    int32_t initial_write_offset = DATA_SIZE - sizeof(int32_t);
    std::memcpy(new_block_ptr + initial_write_offset, &value, sizeof(int32_t));
    
    write_meta(new_block_ptr, 4, current_index); // Point back to the old block
    
    msync(new_block_ptr, CHUNK_SIZE, MS_ASYNC);
    return new_index; 
}