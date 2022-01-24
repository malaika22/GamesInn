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
exports.Application = void 0;
const database_1 = require("./configs/database");
const logger_1 = require("./configs/logger");
const http_1 = require("./server/http");
const logger_2 = require("./server/logger");
const vault_1 = require("./databases/vault");
const sentry_1 = require("./server/sentry");
const types_1 = require("@sentry/types");
const ip = __importStar(require("ip"));
const utils_1 = require("./utils/utils");
const rabbitmq_1 = require("./server/queues/rabbitmq");
const database_2 = require("./databases/database");
const defaultmodel_1 = require("./models/defaultmodel");
const gamesinn_database_1 = require("./databases/gamesinn-database");
const gamer_model_1 = require("./models/gamer-model");
const session_model_1 = require("./models/session-model");
const tokens_model_1 = require("./models/tokens-model");
const email_1 = require("./utils/email/email");
global.__rootdir__ = process.cwd();
class Application {
    constructor() { }
    async INIT(env) {
        global.ip = ip.address();
        global.Url = env.config.URL;
        console.log(global.Url, 'Global Url');
        process.on('unhandledRejection', (ex) => {
            // console.log("Unhandled Execption", ex);
            logger_2.Logger.Log('Unhandled Rejection !!!!!', 'critical');
            logger_2.Logger.Log(ex, "critical");
            //@REVIEW ADD SENTRY EXCEPTION
            let err = ex;
            sentry_1.Sentry.Error(err, 'unhandledRejection in auth');
        });
        process.on('uncaughtException', (ex) => {
            console.log("Unhandled Execption", ex);
            logger_2.Logger.Log('Uncaught Exception !!!!!', 'critical');
            logger_2.Logger.Log(ex, "critical");
            //@REVIEW ADD SENTRY EXCEPTION
            sentry_1.Sentry.Error(ex, 'uncaughtException in auth');
        });
        if (env.config.GracefullShutdown) {
            //Gracefull Reload on Non-Windows Environment
            //Check The documentation on following link
            //https://nodejs.org/api/process.html
            /**
             * @Note :
             * 'SIGTERM' and 'SIGINT' have default handlers on non-Windows platforms that reset the terminal mode before exiting with code 128 + signal number.
             * If one of these signals has a listener installed, its default behavior will be removed (Node.js will no longer exit).
             */
            process.on('SIGINT', async (code) => {
                try {
                    if (!Application.started)
                        process.exit(1);
                    // Stops the server from accepting new connections and finishes existing connections.
                    console.log('SIGINT', code);
                    await rabbitmq_1.RMQ.Dispose();
                    http_1.HTTPServer.StopServer();
                    // process.exit(1);
                    //Kill The Process so that It will be restarted by PM2 or any other process manager
                }
                catch (error) {
                    logger_2.Logger.Log(error, 'critical');
                    sentry_1.Sentry.Error(error, "problem in SIGTERM EVENY occurs in LEAGUE service");
                    process.exit(1);
                }
            });
            process.on('SIGTERM', async () => {
                // Stops the server from accepting new connections and finishes existing connections.
                try {
                    if (!Application.started)
                        process.exit(1);
                    // Stops the server from accepting new connections and finishes existing connections.
                    console.log('SIGTERM');
                    await rabbitmq_1.RMQ.Dispose();
                    http_1.HTTPServer.StopServer();
                    process.exit(1);
                    //Kill The Process so that It will be restarted by PM2 or any other process manager
                }
                catch (error) {
                    logger_2.Logger.Log(error, 'critical');
                    let err = error;
                    sentry_1.Sentry.Error(err, "problem in SIGTERM EVENY occurs in LEAGUE service");
                    process.exit(1);
                }
            });
        }
        try {
            logger_2.Logger.CreateLogger(logger_1.LoggerConf.colors);
            global.servicename = env.config.ServiceName;
            global.environment = env.env;
            global.logger = env.logger;
            global.defaultDB = env.defaultDB;
            global.delayStart = env.delayStart;
            if (!env.config.ServiceName)
                throw new Error('Unknown Service Name');
            if (!env.config.PORT)
                throw new Error('Server Port Not Defined');
            if (env.config.VAULT) {
                if (!env.vault.host)
                    throw new Error('Vault HOST Not Defined');
                if (!env.vault.port)
                    throw new Error('Vault PORT Not Defined');
                if (!env.vault.keyname)
                    throw new Error('Vault KeyName Not Defined');
                if (!env.vault.protocol)
                    throw new Error('Vault Protocol Not Defined');
                if (!env.vault.login)
                    throw new Error('Vault Login Not Defined');
            }
            if (!env.config.VAULT) {
                if (global.defaultDB)
                    await database_2.DefaultDatabase.Connect(database_1.DBConfig.dbconf.default);
                else if (!global.defaultDB)
                    await gamesinn_database_1.GamesInn.Connect(database_1.DBConfig.dbconf.gamesinn);
            }
            else {
                Application.conf = await vault_1.Vault.Init(env);
                if (global.logger == 'sentry')
                    sentry_1.Sentry.INIT({ dsn: Application.conf.Logging.SENTRY.dsn, environment: global.environment, serverName: global.servicename, logLevel: types_1.LogLevel.Error });
                if (global.defaultDB)
                    await database_2.DefaultDatabase.Connect(database_1.DBConfig.dbconf.default);
                else
                    await gamesinn_database_1.GamesInn.Connect(database_1.DBConfig.dbconf.gamesinn);
            }
            /**
             * CREATE EMAIL TRANSPORT IF NEEDED
             */
            if (env.config.EMAIL)
                await email_1.Email.CreateTransport();
            /**
             * TEST DATABASE
             */
            if (global.defaultDB)
                await defaultmodel_1.DefaultModel.INIT();
            await gamer_model_1.GamersModel.INIT();
            await session_model_1.SessionsModel.INIT();
            await tokens_model_1.TokenModel.INIT();
            /**
             * Is Useful in cases where we want to delay queue to start fetching and wait for all the initialization events go trigger to prevent intermittent processing.
             */
            if (global.delayStart)
                await utils_1.Utils.Sleep(global.delayStart);
            if (env.config.QUEUE)
                await rabbitmq_1.RMQ.INIT(Application.conf.RABBITMQ);
            this.httpServer = http_1.HTTPServer.INIT(env.config);
            Object.seal(this.httpServer);
            logger_2.Logger.Console('Server Started : ', 'info');
            Application.started = true;
        }
        catch (error) {
            logger_2.Logger.Console(error, 'error');
            logger_2.Logger.Console('error in Initialising Application');
            sentry_1.Sentry.Error(error, `APP INIT ERROR ${env.config.ServiceName}`);
            //TODO FLUSH LOG IN FILE
            //SEND FAILURE LOG VIA EMAIL
            //EXTERNAL JOB
        }
    }
}
exports.Application = Application;
Application.started = false;
//sigint changes in index.ts & http.ts // left in team and matches
//# sourceMappingURL=app.js.map