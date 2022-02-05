import * as winston from 'winston';
import { LoggerConf } from '../configs/logger';


// LoggerConf

export class Logger {

    private static consoleLogger: winston.Logger;
    private static fileLogger: winston.Logger;
    private static conf: winston.LoggerOptions

    public static Log(msg: any, level = 'info') {
        try {

            if (this.consoleLogger) this.Console(msg, level);
            if (this.fileLogger) this.File(msg, level);

        } catch (error) {
            console.log(error);
            console.log('error in Logger Debug');
        }
    }

    public static Console(msg: any, level = 'info') {
        try {

            if (msg instanceof Error) {
                this.consoleLogger.log(level, msg.message);
                this.consoleLogger.log('info', msg.stack);
            } else {
                if (this.consoleLogger) this.consoleLogger.log(level, msg);
            }

        } catch (error) {
            console.log(error);
            console.log('error in Logger Console');
        }
    }

    public static File(msg: any, level = 'info') {
        try {

            if (msg instanceof Error) {
                this.fileLogger.log(level, msg.message);
                this.fileLogger.log('info', msg.stack);
            } else {
                if (this.fileLogger) this.fileLogger.log(level, msg);
            }



        } catch (error) {
            console.log(error);
            console.log('error in File Logger');
        }
    }

    public static CreateLogger(colors?: winston.config.AbstractConfigSetColors) {
        try {

            (colors) ? winston.addColors(colors) : undefined;
            this.consoleLogger = winston.loggers.add('console', { levels: LoggerConf.levels, transports: LoggerConf.consoleTransport })
            this.fileLogger = winston.loggers.add('file', { levels: LoggerConf.levels, transports: LoggerConf.fileTransport });

        } catch (error) {
            console.log(error);
            console.log('error in Creating Logger');
        }
    }



}