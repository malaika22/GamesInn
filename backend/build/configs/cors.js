"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsConfig = void 0;
class CorsConfig {
}
exports.CorsConfig = CorsConfig;
CorsConfig.confs = {
    "default": {
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "HEAD", "OPTION", "PATCH", "DELETE"],
        origin: ["localhost:4200"]
    },
    "testroute": {}
};
//# sourceMappingURL=cors.js.map