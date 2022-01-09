export interface Payload {
    invoker: ServiceNames,
    expiry: string, //ISO String Format Expected
    method: WebMethods,
    url: string,
    invokedFor: ServiceNames
}


export enum ServiceNames {
    NOVIG_TEAMS_SERVICE = 'teams',
    NOVIG_LEAGUES_SERVICE = 'leagues',
    NOVIG_MATCHES_SERVICE = 'matches'
}

export enum WebMethods {
    GET = 'GET',
    POST= 'POST',
    OPTIONS = 'OPTIONS',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}