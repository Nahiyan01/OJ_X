// data_base/server_context.h
#pragma once

#include <vector>
#include <shared_mutex>
#include <cstdint>

struct ServerContext {
    int fd;
    char* mapped_file;
    size_t file_size;
    std::shared_mutex rw_mutex;
    
    // Holds free indices in RAM for instant access
    std::vector<int32_t> free_indices; 
};