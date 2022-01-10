"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const payload_1 = require("../interfaces/payload");
const logger_1 = require("../server/logger");
const axios_1 = __importDefault(require("axios"));
const sentry_1 = require("../server/sentry");
class Utils {
    // private static salt = Application.conf?.ENCRYPTION.salt
    /**
     *
     * @param ms
     * @returns void
     *
     * @Description : Testing methods for halting Thread
     */
    static async Sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
    static OTPGenerator() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    static GuestUserName() {
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let length = 12;
        let randomStr = "";
        for (let i = 0; i < length; i++) {
            let randomNum = Math.floor(Math.random() * characters.length);
            randomStr += characters[randomNum];
        }
        return 'Guest_' + randomStr;
    }
    static GenerateEmail(e) {
        let email = e.toLowerCase();
        let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        // Logger.Console(`Email ===> ${email}`, 'info');
        let checkEmail = email.match(emailRegex);
        // Logger.Console(`Check Rmail ${checkEmail}`, 'info')
        return { checkEmail, email };
    }
    static GenerateAccessToken(obj) {
        switch (obj.invoker) {
            case 'matches':
                return JSON.stringify(obj);
            case 'teams':
                return JSON.stringify(obj);
            default:
                console.log("Error in unknown service");
                throw new Error('Unknown Service');
        }
    }
    static GenerateTeamObject(name, teamId, logoUrl, markUrl, fullName) {
        return { teamId, name, logoUrl, markUrl, fullName };
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
    static GetFutureDate(number, type = 'ms') {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000;
                break;
            case 'min':
                number = number * 60;
                break;
            case 'hours':
                number = number * 3600;
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
    static GetFutureDateISOString(number, type = 'ms') {
        let date = new Date();
        switch (type) {
            case 'ms':
                number = number / 1000;
                break;
            case 'min':
                number = number * 60;
                break;
            case 'hours':
                number = number * 3600;
                break;
            default:
                break;
        }
        date.setSeconds(date.getSeconds() + number);
        return date.toISOString();
    }
    static GeneratePayload(invoker, invokedFor, methodType, path) {
        try {
            let url = '';
            if (path && path[0] != '/')
                throw new Error('Invalid Path In Generating Path Missing "\/" at beginning');
            switch (invokedFor) {
                case payload_1.ServiceNames.NOVIG_LEAGUES_SERVICE:
                    url = process.env.LEAGUE_URL + path;
                    break;
                case payload_1.ServiceNames.NOVIG_MATCHES_SERVICE:
                    url = process.env.MATCHES_URL + path;
                    break;
                case payload_1.ServiceNames.NOVIG_TEAMS_SERVICE:
                    url = process.env.TEAMS_URL + path;
                    break;
                default:
                    break;
            }
            let payload = {
                "invoker": invoker,
                "expiry": Utils.GetFutureDateISOString(20000),
                "method": methodType,
                "url": `${process.env.LEAGUE_URL}/All`,
                "invokedFor": invokedFor
            };
            return payload;
        }
        catch (error) {
            let err = error;
            sentry_1.Sentry.Error(err, "Error in GENERATING PAYLOAD UTILS");
            throw err;
        }
    }
    static ValidatePayload(payload) {
        try {
            let valid = true;
            if (!payload.hasOwnProperty('invoker'))
                valid = false;
            if (!payload.hasOwnProperty('expiry'))
                valid = false;
            if (!payload.hasOwnProperty('method'))
                valid = false;
            if (!payload.hasOwnProperty('url'))
                valid = false;
            if (!payload.hasOwnProperty('invokedFor'))
                valid = false;
            if (!valid)
                return false;
            else
                return true;
        }
        catch (error) {
            let err = error;
            logger_1.Logger.Console(`error in Validate Payload ===> ${err.toString()}`, 'info');
            sentry_1.Sentry.Error(err, "Error in Validating Payload UTILS");
            throw err.toString();
        }
    }
    static isExpired(payload) {
        return (payload.expiry > new Date().toISOString()) ? true : false;
    }
    static async DownloadImage(url) {
        try {
            let res = await axios_1.default.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(res.data, 'binary').toString('base64');
            //.then(response => Buffer.from(response.data, 'binary').toString('base64'))
        }
        catch (error) {
            let err = error;
            sentry_1.Sentry.Error(err, "Error in Downloading IMage");
            logger_1.Logger.Console(`Error: ${JSON.stringify(err.toString())}`, 'critical');
        }
    }
    static TestError() {
        try {
            let data = {};
            console.log(data.name.abc);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map