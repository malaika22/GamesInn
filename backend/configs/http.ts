export interface HTTPCONF {

    PORT: number;
    AllowCors: boolean;
    GracefullShutdown: boolean
    VAULT: boolean,
    ServiceName: string,
    QUEUE: boolean
}
