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
exports.Sentry = void 0;
const sentry = __importStar(require("@sentry/node"));
const logger_1 = require("./logger");
const integrations_1 = require("@sentry/integrations");
class Sentry {
    static INIT(conf) {
        if (global.logger != 'sentry')
            return;
        // console.log('Sentry : ', conf);
        conf.integrations = [new integrations_1.RewriteFrames({
                root: global.__rootdir__,
                iteratee: (frame) => { return frame; }
            })];
        sentry.init(conf);
        this.tags = {
            'server_name': global.servicename,
            'ip': global.ip
        };
    }
    static Log(msg) {
        try {
            if (global.logger != 'sentry')
                return;
            let ctx = {
                level: sentry.Severity.Log,
                tags: this.tags
            };
            sentry.captureMessage(msg, ctx);
        }
        catch (error) {
            logger_1.Logger.Console(error);
        }
    }
    static Event(event) {
        try {
            if (global.logger != 'sentry')
                return;
            sentry.captureEvent(event);
        }
        catch (error) {
            logger_1.Logger.Console(error);
        }
    }
    static Error(msg, name) {
        try {
            if (global.logger != 'sentry')
                return;
            // if (!(msg instanceof Error)) msg = new Error((typeof msg == 'string') ? msg : JSON.stringify(msg, undefined, 4));
            let ctx = {
                level: sentry.Severity.Critical,
                tags: this.tags,
            };
            // let temp = new Error(msg.message);
            // temp.stack = msg.stack
            // temp.name = msg.name;
            msg.name = name;
            // console.log('CTX :', ctx);
            sentry.captureException(msg, ctx);
        }
        catch (error) {
            logger_1.Logger.Console(error);
        }
    }
}
exports.Sentry = Sentry;
Sentry.tags = {};
//# sourceMappingURL=sentry.js.map