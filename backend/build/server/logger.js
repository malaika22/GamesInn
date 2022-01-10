"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = __importStar(require("winston"));
const logger_1 = require("../configs/logger");
// LoggerConf
class Logger {
    static Log(msg, level = 'info') {
        try {
            if (this.consoleLogger)
                this.Console(msg, level);
            if (this.fileLogger)
                this.File(msg, level);
        }
        catch (error) {
            console.log(error);
            console.log('error in Logger Debug');
        }
    }
    static Console(msg, level = 'info') {
        try {
            if (msg instanceof Error) {
                this.consoleLogger.log(level, msg.message);
                this.consoleLogger.log('info', msg.stack);
            }
            else {
                if (this.consoleLogger)
                    this.consoleLogger.log(level, msg);
            }
        }
        catch (error) {
            console.log(error);
            console.log('error in Logger Console');
        }
    }
    static File(msg, level = 'info') {
        try {
            if (msg instanceof Error) {
                this.fileLogger.log(level, msg.message);
                this.fileLogger.log('info', msg.stack);
            }
            else {
                if (this.fileLogger)
                    this.fileLogger.log(level, msg);
            }
        }
        catch (error) {
            console.log(error);
            console.log('error in File Logger');
        }
    }
    static CreateLogger(colors) {
        try {
            (colors) ? winston.addColors(colors) : undefined;
            this.consoleLogger = winston.loggers.add('console', { levels: logger_1.LoggerConf.levels, transports: logger_1.LoggerConf.consoleTransport });
            this.fileLogger = winston.loggers.add('file', { levels: logger_1.LoggerConf.levels, transports: logger_1.LoggerConf.fileTransport });
        }
        catch (error) {
            console.log(error);
            console.log('error in Creating Logger');
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map