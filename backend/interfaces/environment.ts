import { HTTPCONF } from "../configs/http";

export interface Environment {
    env: string;
    defaultDB: boolean;
    logger: 'sentry',
    delayStart: number;
    config : HTTPCONF,
    vault: {
        protocol: string,
        host: string
        port?: number;
        login: string;
        keyname: string;
        apiversion: string;
    }
}