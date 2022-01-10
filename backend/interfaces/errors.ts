export abstract class Errors {

    public static InvalidCredentials = {
        status: 400,
        message: "Invalid Credentials"
    }

    public static BadRequest = {
        status: 400,
        message: "Invalid Request",
    }

    public static Unauthorized = {
        status: 401,
        message: "Authentication Failed"
    }

    public static Forbidden = {
        status: 403,
        message: "Permission Denied"
    }
    public static NOTFOUND = {
        status: 403,
        message: "Permission Denied"
    }

    public static INTERNALERROR = {
        status: 500,
        message: "Internal Server Error"
    }

    public static BADGATEWAY = {
        status: 502,
        message: "Bad Gateway"
    }



}

export enum ErrorStatus {
    BADGATEWAY = 502,
    INTERNALERROR = 500,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401,
    BADQEQUEST = 400,
    OK = 200
}

