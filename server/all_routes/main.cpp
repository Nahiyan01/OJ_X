#include "httplib.h"
#include "data_base/server_context.h"
#include "data_base/database.h"
#include <iostream>

int main() {
    ServerContext ctx;
    
    // 1. Boot up the database memory map
    db_init(ctx);

    httplib::Server svr;

    // 2. The Single Master API Endpoint
    svr.Post("/api/ask", [&ctx](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");

        int type = 0;
        int index = 0; // Fixed: defaults to a valid index (0)
        int32_t value = 0;

        if (req.has_param("type")) {
            try { type = std::stoi(req.get_param_value("type")); } catch (...) { type = 0; }
        }
        if (req.has_param("index")) {
            try { index = std::stoi(req.get_param_value("index")); } catch (...) { index = 0; }
        }
        if (req.has_param("value")) {
            try { value = std::stoi(req.get_param_value("value")); } catch (...) { value = 0; }
        }

        if (type == 1) {
            int new_index = db_insert_tx(ctx, req.body);
            res.set_content(std::to_string(new_index), "text/plain");
        } else if (type == 2) {
            bool success = db_delete_chunk(ctx, index);
            res.set_content(success ? "Deleted" : "Failed", "text/plain");
        } else if (type == 3) {
            std::string data = db_read_chunk(ctx, index);
            res.set_content(data, "application/octet-stream");
        } else if (type == 4) {
            std::string data = db_read_related_chunks(ctx, index);
            res.set_content(data, "application/octet-stream");
        } else if (type == 5) {
            int new_index = db_insert_int(ctx, index, value);
            res.set_content(std::to_string(new_index), "text/plain");
        } else {
            res.status = 400;
            res.set_content("Invalid or missing 'type' parameter", "text/plain");
        }
    });

    std::cout << "Server running at http://localhost:8080/api/ask" << std::endl;
    svr.listen("0.0.0.0", 8080);

    return 0;
}