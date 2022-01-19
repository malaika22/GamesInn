
import axios from 'axios';
import crypto from 'crypto'

import { Payload, ServiceNames, WebMethods } from '../interfaces/payload';
import { Logger } from '../server/logger';
import { Sentry } from '../server/sentry';

export abstract class Utils {

    // private static salt = Application.conf?.ENCRYPTION.salt



    /**
     * 
     * @param ms 
     * @returns void
     * 
     * @Description : Testing methods for halting Thread
     */
    public static async Sleep(ms: number) {
        return new Promise((resolve: any, reject: any) => {
            setTimeout(() => {
                resolve()
            }, ms);
        })
    }

    public static OTPGenerator() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    public static GuestUserName() {
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let length = 12;
        let randomStr = "";
        for (let i = 0; i < length; i++) {
            let randomNum = Math.floor(Math.random() * characters.length);
            randomStr += characters[randomNum];
        }
        return 'Guest_' + randomStr
    }

    public static GenerateEmail(e: string) {
        let email = e.toLowerCase()
        let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        // Logger.Console(`Email ===> ${email}`, 'info');
        let checkEmail = email.match(emailRegex)
        // Logger.Console(`Check Rmail ${checkEmail}`, 'info')
        return { checkEmail, email }
    }


    public static GenerateAccessToken(obj: Payload) {
        switch (obj.invoker) {
            case 'matches':
                return JSON.stringify(obj);
            case 'teams':
                return JSON.stringify(obj)
            default:
                console.log("Error in unknown service")
                throw new Error('Unknown Service');
        }

    }

    public static GenerateTeamObject(name: string, teamId: number, logoUrl: string, markUrl: string, fullName: string) {
        return { teamId, name, logoUrl, markUrl, fullName }
    }

    /**
     * 
     * @param number <seconds>
     * @param type @Default <milliseconds> 
     * @returns Date Object
     * 
     * @Note : It will always add seconds to Current DateTime. However If you want to add Minut/Hours
     * Provide type explicitly.
     * 
     */

    public static GetFutureDate(number: number, type = 'ms'): Date {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000
                break;
            case 'min':
                number = number * 60
                break;
            case 'hours':
                number = number * 3600
                break;
            default:
                break;
        }
        date.setSeconds(date.getSeconds() + number);
        return date;
    }

    /**
     * 
     * @param number <seconds>
     * @param type @Default <milliseconds> 
     * @returns <DATE ISO STRING>
     * 
     * @Note : It will always add seconds to Current DateTime. However If you want to add Minut/Hours
     * Provide type explicitly.
     * 
     */

    public static GetFutureDateISOString(number: number, type = 'ms'): string {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000
                break;
            case 'min':
                number = number * 60
                break;
            case 'hours':
                number = number * 3600
                break;
            default:
                break;
        }
        date.setSeconds(date.getSeconds() + number);
        return date.toISOString();
    }


    public static GeneratePayload(invoker: ServiceNames, invokedFor: ServiceNames, methodType: WebMethods, path: string): Payload {

        try {
            let url = ''
            if (path && path[0] != '/') throw new Error('Invalid Path In Generating Path Missing "\/" at beginning')
            switch (invokedFor) {
                case ServiceNames.NOVIG_LEAGUES_SERVICE:
                    url = process.env.LEAGUE_URL + path
                    break;
                case ServiceNames.NOVIG_MATCHES_SERVICE:
                    url = process.env.MATCHES_URL + path
                    break;
                case ServiceNames.NOVIG_TEAMS_SERVICE:
                    url = process.env.TEAMS_URL + path
                    break;
                default:
                    break;
            }

            let payload: Payload = {
                "invoker": invoker,
                "expiry": Utils.GetFutureDateISOString(20000),
                "method": methodType,
                "url": `${process.env.LEAGUE_URL}/All`,
                "invokedFor": invokedFor
            }

            return payload;


        } catch (error) {
            let err: any = error;
            Sentry.Error(err, "Error in GENERATING PAYLOAD UTILS");
            throw err
        }


    }


    public static ValidatePayload(payload: Payload) {

        try {
            let valid = true;
            if (!(payload as Object).hasOwnProperty('invoker')) valid = false;
            if (!(payload as Object).hasOwnProperty('expiry')) valid = false;
            if (!(payload as Object).hasOwnProperty('method')) valid = false;
            if (!(payload as Object).hasOwnProperty('url')) valid = false;
            if (!(payload as Object).hasOwnProperty('invokedFor')) valid = false;


            if (!valid) return false;

            else return true;


        } catch (error) {
            let err: any = error;
            Logger.Console(`error in Validate Payload ===> ${err.toString()}`, 'info')
            Sentry.Error(err, "Error in Validating Payload UTILS");

            throw err.toString();
        }
    }

    public static isExpired(payload: Payload): boolean {

        return (payload.expiry > new Date().toISOString()) ? true : false;


    }





    public static async DownloadImage(url: string) {
        try {
            let res = await axios.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(res.data, 'binary').toString('base64')
            //.then(response => Buffer.from(response.data, 'binary').toString('base64'))
        } catch (error) {
            let err: any = error;
            Sentry.Error(err, "Error in Downloading IMage");
            Logger.Console(`Error: ${JSON.stringify(err.toString())}`, 'critical')
        }
    }




    public static TestError() {

        try {
            let data: any = {};
            console.log(data.name.abc)

        } catch (error: any) {

            throw error;
        }
    }


    public static RandomStringGenerator(){
       return crypto.randomBytes(8).toString('hex')
    }

}