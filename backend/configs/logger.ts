import * as winston from 'winston';
require('winston-daily-rotate-file');


export abstract class LoggerConf {

    public static levels: winston.config.AbstractConfigSetLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        critical: 5
    };

    public static colors: winston.config.AbstractConfigSetColors = {
        error: "white",
        warn: "yellow",
        info: "green",
        http: "blue",
        debug: "white",
        critical: "red"
    };

    public static customLevels: winston.config.AbstractConfigSet = {
        colors: LoggerConf.colors,
        levels: LoggerConf.levels
    }

    public static consoleTransport: Array<winston.transport> = [
        new winston.transports.Console({
            level: "critical",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })


    ] as Array<winston.transport>

    public static fileTransport: Array<winston.transport> = [
        new (winston.transports as any).DailyRotateFile({
            level: "critical",
            frequency: '12h',
            dirname: (process.cwd() + '/logs/'),
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD', //For Hour Inclusion change date pattern to 'YYYY-MM-DD-HH'
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d'
        })

    ] as Array<winston.transport>
}