"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStatus = exports.Errors = void 0;
class Errors {
}
exports.Errors = Errors;
Errors.InvalidCredentials = {
    status: 400,
    message: "Invalid Credentials"
};
Errors.BadRequest = {
    status: 400,
    message: "Invalid Request",
};
Errors.Unauthorized = {
    status: 401,
    message: "Authentication Failed"
};
Errors.Forbidden = {
    status: 403,
    message: "Permission Denied"
};
Errors.NOTFOUND = {
    status: 403,
    message: "Permission Denied"
};
Errors.INTERNALERROR = {
    status: 500,
    message: "Internal Server Error"
};
Errors.BADGATEWAY = {
    status: 502,
    message: "Bad Gateway"
};
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["BADGATEWAY"] = 502] = "BADGATEWAY";
    ErrorStatus[ErrorStatus["INTERNALERROR"] = 500] = "INTERNALERROR";
    ErrorStatus[ErrorStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorStatus[ErrorStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorStatus[ErrorStatus["BADQEQUEST"] = 400] = "BADQEQUEST";
    ErrorStatus[ErrorStatus["OK"] = 200] = "OK";
})(ErrorStatus = exports.ErrorStatus || (exports.ErrorStatus = {}));
//# sourceMappingURL=errors.js.map