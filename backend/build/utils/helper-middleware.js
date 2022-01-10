"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const vault_1 = require("../databases/vault");
const logger_1 = require("../server/logger");
const sentry_1 = require("../server/sentry");
const utils_1 = require("./utils");
/**
 * @NOTE : IMPORTANT.
 * ********************************************
 * * Never Call this class in Child Worker * *
 * ********************************************
 */
class Helper {
    /**
  * @Note : Following Function is to Authenticate Server to Server Call Between Services.
  * Following Authentication might change in future when we decide to move to gRPC protocol for Inter Service Communications
  * @param token
  * @returns <boolean>
  */
    static AunthenticateService(token) {
        try {
            // console.log('AUTHENTICATION TOKEN : ', token);
            // Logger.Log(`Token ===> ${JSON.stringify(token, undefined, 4)}`)
            if (!token)
                return { status: 400, msg: 'Invalid Payload' };
            let decryptedData = vault_1.Vault.Decrypt(token);
            logger_1.Logger.Console(`Decrypted Data === > ${decryptedData}`);
            try {
                let decodedPayload = JSON.parse(decryptedData);
                if (!utils_1.Utils.ValidatePayload(decodedPayload))
                    return { status: 400, msg: 'Invalid Payload' };
                if (!utils_1.Utils.isExpired(decodedPayload))
                    return { status: 404, msg: 'Token Expired' };
            }
            catch (error) {
                console.log('UNable To Decode JWT : ', decryptedData);
                throw new Error('Decrypt JWT ERROR Payload');
            }
            // Logger.Console(`payload object===> ${JSON.stringify(decodedPayload, undefined, 4)}`)
            return { status: 200, msg: 'success' };
        }
        catch (error) {
            let err = error;
            console.log(token);
            sentry_1.Sentry.Error(err, "ERROR IN AUTHENTICATION PAYLOAD");
            return { status: 500, msg: err.toString() };
        }
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper-middleware.js.map