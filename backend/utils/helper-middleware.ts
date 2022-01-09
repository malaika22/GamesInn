import { Vault } from "../databases/vault";
import { Logger } from "../server/logger";
import { Sentry } from "../server/sentry";
import { Utils } from "./utils";


/**
 * @NOTE : IMPORTANT. 
 * ********************************************
 * * Never Call this class in Child Worker * *
 * ********************************************
 */

export abstract class Helper {
    /**
  * @Note : Following Function is to Authenticate Server to Server Call Between Services.
  * Following Authentication might change in future when we decide to move to gRPC protocol for Inter Service Communications
  * @param token 
  * @returns <boolean>
  */
    public static AunthenticateService(token: string): { status: number, msg: string } {

        try {
            // console.log('AUTHENTICATION TOKEN : ', token);
            // Logger.Log(`Token ===> ${JSON.stringify(token, undefined, 4)}`)
            if (!token) return { status: 400, msg: 'Invalid Payload' };

            let decryptedData: any = Vault.Decrypt(token)
            Logger.Console(`Decrypted Data === > ${decryptedData}`)

            try {

                let decodedPayload: any = JSON.parse(decryptedData);
                if (!Utils.ValidatePayload(decodedPayload)) return { status: 400, msg: 'Invalid Payload' };


                if (!Utils.isExpired(decodedPayload)) return { status: 404, msg: 'Token Expired' };
            } catch (error) {

                console.log('UNable To Decode JWT : ', decryptedData);
                throw new Error('Decrypt JWT ERROR Payload');
            }
            // Logger.Console(`payload object===> ${JSON.stringify(decodedPayload, undefined, 4)}`)




            return { status: 200, msg: 'success' };



        } catch (error) {
            let err: any = error;
            console.log(token);
            Sentry.Error(err, "ERROR IN AUTHENTICATION PAYLOAD");
            return { status: 500, msg: err.toString() }

        }

    }

}