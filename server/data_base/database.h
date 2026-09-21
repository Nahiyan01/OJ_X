#pragma once
#include "server_context.h"
#include <string>
#include <cstdint> // Added for int32_t

// Initialize the database (Runs once on startup)
void db_init(ServerContext& ctx);

int db_insert_tx(ServerContext& ctx, const std::string& payload);
bool db_delete_chunk(ServerContext& ctx, int index);
std::string db_read_chunk(ServerContext& ctx, int index);
std::string db_read_related_chunks(ServerContext& ctx, int index);
int db_insert_int(ServerContext& ctx, int current_index, int32_t value);