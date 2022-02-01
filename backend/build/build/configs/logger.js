"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerConf = void 0;
const winston = __importStar(require("winston"));
require('winston-daily-rotate-file');
class LoggerConf {
}
exports.LoggerConf = LoggerConf;
LoggerConf.levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    critical: 5
};
LoggerConf.colors = {
    error: "white",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "white",
    critical: "red"
};
LoggerConf.customLevels = {
    colors: LoggerConf.colors,
    levels: LoggerConf.levels
};
LoggerConf.consoleTransport = [
    new winston.transports.Console({
        level: "critical",
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
];
LoggerConf.fileTransport = [
    new winston.transports.DailyRotateFile({
        level: "critical",
        frequency: '12h',
        dirname: (process.cwd() + '/logs/'),
        filename: 'log-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '14d'
    })
];
//# sourceMappingURL=logger.js.map