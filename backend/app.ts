import { DBConfig } from "./configs/database";
import { HTTPCONF } from "./configs/http";
import { LoggerConf } from "./configs/logger";
import { HTTPServer } from "./server/http";
import { Logger } from "./server/logger";
import { APPCONFIG } from "./interfaces/appconfig";
import { Environment } from "./interfaces/environment";
import { Vault } from "./databases/vault";
import { Sentry } from "./server/sentry";

import { LogLevel } from "@sentry/types";
import * as ip from 'ip';

import { Utils } from "./utils/utils";
import { RMQ } from "./server/queues/rabbitmq";
import { DefaultDatabase } from "./databases/database";
import { DefaultModel } from "./models/defaultmodel";
import { GamesInn } from "./databases/gamesinn-database";

import { GamersModel } from "./models/gamer-model";
import { SessionsModel } from "./models/session-model";
import { TokenModel } from "./models/tokens-model";
import { Email } from "./utils/email/email";
// import { OpenAPIConfiguration } from "./controllers/documentation/config_openapi";

// import { runme } from "./controllers/documentation/api-documentations";
// import { OpenAPIConfiguration } from "./controllers/documentation/config_openapi";

// // Instead of:
// import sourceMapSupport from 'source-map-support'
// sourceMapSupport.install()


declare global {
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
            servicename: string;
            ip: string;
            environment: string;
            defaultDB: boolean;
            logger: string;
            delayStart: number;
            Url:string
        }
    }
}
global.__rootdir__ = process.cwd();

export class Application {
    public static conf: APPCONFIG;
    public static started: boolean = false;

    private httpServer!: HTTPServer;
    constructor() { }
    public async INIT(env: Environment) {
        global.ip = ip.address();
        global.Url = env.config.URL;
        console.log(global.Url , 'Global Url')
        process.on('unhandledRejection', (ex) => {
            // console.log("Unhandled Execption", ex);
            Logger.Log('Unhandled Rejection !!!!!', 'critical');

            Logger.Log(ex, "critical");
            //@REVIEW ADD SENTRY EXCEPTION
            let err: any = ex;
            Sentry.Error((err as any), 'unhandledRejection in auth');

        })

        process.on('uncaughtException', (ex) => {
            console.log("Unhandled Execption", ex);
            Logger.Log('Uncaught Exception !!!!!', 'critical');
            Logger.Log(ex, "critical");
            //@REVIEW ADD SENTRY EXCEPTION
            Sentry.Error(ex as any, 'uncaughtException in auth');

        })

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
                    if (!Application.started) process.exit(1);

                    // Stops the server from accepting new connections and finishes existing connections.
                    console.log('SIGINT', code);
                    await RMQ.Dispose();
                    HTTPServer.StopServer()

                    // process.exit(1);


                    //Kill The Process so that It will be restarted by PM2 or any other process manager

                } catch (error: any) {
                    Logger.Log(error, 'critical');
                    Sentry.Error(error as any, "problem in SIGTERM EVENY occurs in LEAGUE service");

                    process.exit(1);

                }


            });

            process.on('SIGTERM', async () => {
                // Stops the server from accepting new connections and finishes existing connections.
                try {
                    if (!Application.started) process.exit(1);

                    // Stops the server from accepting new connections and finishes existing connections.
                    console.log('SIGTERM');
                    await RMQ.Dispose();
                    HTTPServer.StopServer();

                    process.exit(1);


                    //Kill The Process so that It will be restarted by PM2 or any other process manager

                } catch (error) {
                    Logger.Log(error, 'critical');
                    let err: any = error;

                    Sentry.Error(err as any, "problem in SIGTERM EVENY occurs in LEAGUE service");
                    process.exit(1);

                }
            })

        }





        try {

            Logger.CreateLogger(LoggerConf.colors)

            global.servicename = env.config.ServiceName;
            global.environment = env.env;
            global.logger = env.logger;
            global.defaultDB = env.defaultDB;
            global.delayStart = env.delayStart;

            if (!env.config.ServiceName) throw new Error('Unknown Service Name');
            if (!env.config.PORT) throw new Error('Server Port Not Defined');

            if (env.config.VAULT) {

                if (!env.vault.host) throw new Error('Vault HOST Not Defined');
                if (!env.vault.port) throw new Error('Vault PORT Not Defined');
                if (!env.vault.keyname) throw new Error('Vault KeyName Not Defined');
                if (!env.vault.protocol) throw new Error('Vault Protocol Not Defined');
                if (!env.vault.login) throw new Error('Vault Login Not Defined');
            }

            if (!env.config.VAULT) {

                if (global.defaultDB) await DefaultDatabase.Connect(DBConfig.dbconf.default)
                else if (!global.defaultDB) await GamesInn.Connect(DBConfig.dbconf.gamesinn)

            } else {

                Application.conf = await Vault.Init(env as Environment);
                if (global.logger == 'sentry') Sentry.INIT({ dsn: Application.conf.Logging.SENTRY.dsn, environment: global.environment, serverName: global.servicename, logLevel: LogLevel.Error });
                if (global.defaultDB) await DefaultDatabase.Connect(DBConfig.dbconf.default);
                else await GamesInn.Connect(DBConfig.dbconf.gamesinn)
            }

            /**
             * CREATE EMAIL TRANSPORT IF NEEDED
             */
            if(env.config.EMAIL) await Email.CreateTransport()



            /**
             * TEST DATABASE
             */
            if (global.defaultDB) await DefaultModel.INIT();
            await GamersModel.INIT()
            await SessionsModel.INIT()
            await TokenModel.INIT()

            /**
             * Is Useful in cases where we want to delay queue to start fetching and wait for all the initialization events go trigger to prevent intermittent processing.
             */
            if (global.delayStart) await Utils.Sleep(global.delayStart);

            if (env.config.QUEUE) await RMQ.INIT(Application.conf.RABBITMQ);

            this.httpServer = HTTPServer.INIT(env.config);

            Object.seal(this.httpServer);
            Logger.Console('Server Started : ', 'info');
            Application.started = true;

        } catch (error: any) {

            Logger.Console(error, 'error');
            Logger.Console('error in Initialising Application');
            Sentry.Error(error, `APP INIT ERROR ${env.config.ServiceName}`);

            //TODO FLUSH LOG IN FILE
            //SEND FAILURE LOG VIA EMAIL
            //EXTERNAL JOB
        }

    }
}





//sigint changes in index.ts & http.ts // left in team and matches