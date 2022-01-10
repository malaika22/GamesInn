import { DBConfigMongo } from "../configs/database";

export interface SMTP {
    [key: string]: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        }
    }
}


export interface AESEncryption {
    salt: string;
    iv: string;
}

export interface Sentry {
    dsn: string;
    security_header_endpoint: string;
    minidumo_endpoint: string;
}

export interface Logging {
    SENTRY: Sentry
}

export interface FCM {
    server_key: string;
    sender_id: string;
}

export interface RabbitMQ {
    host: string;
    port?: number;
    protocol: 'amqp' | 'stomp';
    user: string;
    password: string;
}
export interface REDIS {
    LivePush: {}
}

export interface AWS {
    s3: {
        access_key_id: string;
        secret_access_key: string;
    },
    sqs: {},
    sns: {},
    ses: {}
}




export interface DB {
    Mongo: {
        [key: string]: DBConfigMongo
    },
    psql: {},
    solr: {}
}

export interface APIKEYS {

}


export interface APPCONFIG {
    ENV: string;
    SMTP: SMTP;
    ENCRYPTION: AESEncryption;
    Logging: Logging;
    FCM: FCM,
    RABBITMQ: RabbitMQ,
    REDIS: REDIS,
    AWS: AWS,
    DB: DB,
    APIKEYS: APIKEYS
}

