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
exports.WorkerManager = void 0;
const cp = __importStar(require("child_process"));
const database_1 = require("../configs/database");
const locking_model_1 = require("../models/locking-model");
const logger_1 = require("../server/logger");
var LockTypes;
(function (LockTypes) {
    LockTypes["SYNC_TEST"] = "synctest";
})(LockTypes || (LockTypes = {}));
class WorkerManager {
    constructor() { }
    static async StartWorker() {
        if (await locking_model_1.WorkerLock.isLocked(LockTypes.SYNC_TEST))
            return;
        else {
            console.log('Inside worker manager');
            await locking_model_1.WorkerLock.CreateLock(LockTypes.SYNC_TEST);
            let worker = cp.fork(process.cwd() + '/build/workers/sync-matches.js', { env: { conf: JSON.stringify(database_1.DBConfig.dbconf.default) }, detached: true });
            worker.on('message', (msg) => {
                logger_1.Logger.Console(`Message Received From Child : ${msg.toString()}`);
            });
            worker.on('error', (err) => {
                logger_1.Logger.Console(`error in Worker : ${err.toString()}`);
            });
            worker.on('exit', async (code) => {
                logger_1.Logger.Console(`Worker Exited : ${code === null || code === void 0 ? void 0 : code.toString()}`);
                await locking_model_1.WorkerLock.ReleaseLock(LockTypes.SYNC_TEST);
            });
            worker.on('close', async (code) => {
                logger_1.Logger.Console(`Worker Closed : ${code === null || code === void 0 ? void 0 : code.toString()}`);
                await locking_model_1.WorkerLock.ReleaseLock(LockTypes.SYNC_TEST);
            });
            worker.on('spawn', (code) => {
                logger_1.Logger.Console(`Worker Closed : ${code === null || code === void 0 ? void 0 : code.toString()}`);
            });
            worker.unref();
        }
    }
}
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=worker-manager.js.map