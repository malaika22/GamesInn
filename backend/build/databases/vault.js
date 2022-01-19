"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vault = void 0;
/**
 * Vault Library Tutorial Can be found from following link
 * https://www.npmjs.com/package/node-vault?source=post_page-----dc108cea0353----------------------
 * @NOTE: Using HashiCorp VaultDB for Centralizing and Securing Configs for Microservices
 *
 * @NOTE : We're keeping vault secrets in environments currently. But a better practice would be providing Vault configs and login tokens from
 * Deployment tool. We prefer Jenkins. This will be impleted later when CI/CD Pipeline wil ltake place. For reference check following Link
 * https://learn.hashicorp.com/tutorials/vault/pattern-approle?in=vault/recommended-patterns
 */
const vault = __importStar(require("node-vault"));
const jwt = __importStar(require("jsonwebtoken"));
const app_1 = require("../app");
const logger_1 = require("../server/logger");
const crypto = __importStar(require("crypto"));
const pbkdf2_1 = __importDefault(require("pbkdf2"));
class Vault {
    constructor() { }
    static async Init(conf) {
        try {
            this.conf = conf;
            let vaultConf = {
                apiVersion: conf.vault.apiversion,
                endpoint: conf.vault.protocol + '://' + conf.vault.host + ":" + 8200,
                token: conf.vault.login
            };
            this.client = vault.default(vaultConf);
            let appConfig = await this.client.read(`kv/gamesinn`);
            console.log(appConfig.data, 'data from vault');
            // let appConfig = await this.client.list('kv/')
            // console.log(appConfig);
            // console.log(appConfig.data);
            return appConfig.data;
        }
        catch (error) {
            logger_1.Logger.Console(`Error in Initializing Vault : ${JSON.stringify(error)}`);
            throw error;
        }
    }
    static async CheckConnection(conf) {
        try {
            let vaultConf = {
                apiVersion: conf.vault.apiversion,
                endpoint: conf.vault.protocol + "://" + conf.vault.host + ":" + 8200,
                token: conf.vault.login,
            };
            this.client = vault.default(vaultConf);
            // console.log(await this.client.health(), 'client for vault');
            let appConfig = await this.client.read(`secrets/${conf.vault.keyname}`);
            // let appConfig = await this.client.list('kv/')
            // console.log(appConfig);
            // console.log(appConfig.data);
            return appConfig.data ? true : false;
        }
        catch (error) {
            logger_1.Logger.Console(`Error in Initializing Vault : ${JSON.stringify(error)}`);
            return error;
        }
    }
    static async GetVaultData() {
        let appConfig = await this.client.read(`kv/${Vault.conf.vault.keyname}`);
        return appConfig.data;
    }
    static async UpdateVaultData() {
        let appConfig = await this.client.read(`kv/${Vault.conf.vault.keyname}`);
        return appConfig.data;
    }
    static Encrypt(value) {
        var _a, _b;
        console.log("jwt String ===> ", value);
        let algorithm = "aes-256-cbc";
        // generate 16 bytes of random data
        // protected data
        // secret key generate 32 bytes of random data
        let Securitykey = ((_a = app_1.Application.conf) === null || _a === void 0 ? void 0 : _a.ENCRYPTION.salt) || Vault.salt;
        let iv = Buffer.from(((_b = app_1.Application.conf) === null || _b === void 0 ? void 0 : _b.ENCRYPTION.iv) || Vault.iv);
        // the cipher function
        let cipher = crypto.createCipheriv(algorithm, Securitykey, iv);
        // encrypt the message
        // input encoding
        // output encoding
        let encryptedData = cipher.update(value, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        // console.log("Encrypted message: " + encryptedData);
        return encryptedData;
    }
    static Decrypt(value) {
        var _a, _b;
        // the decipher function
        let algorithm = "aes-256-cbc";
        // generate 16 bytes of random data
        // protected data
        // secret key generate 32 bytes of random data
        let Securitykey = ((_a = app_1.Application.conf) === null || _a === void 0 ? void 0 : _a.ENCRYPTION.salt) || Vault.salt;
        let iv = Buffer.from(((_b = app_1.Application.conf) === null || _b === void 0 ? void 0 : _b.ENCRYPTION.iv) || Vault.iv);
        let decipher = crypto.createDecipheriv(algorithm, Securitykey, iv);
        let decryptedData = decipher.update(value, "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        return decryptedData;
        // console.log("Decrypted message: " + decryptedData);
    }
    static VerifyHashedPassword(password, original) {
        var _a;
        console.log(`Password: ${password},  originalPassword: ${original}`);
        let salt = ((_a = app_1.Application.conf) === null || _a === void 0 ? void 0 : _a.ENCRYPTION.salt) || Vault.salt;
        let hash = pbkdf2_1.default.pbkdf2Sync(password, salt, 1, 32, 'sha256').toString('hex');
        return (hash === original) ? true : false;
    }
    static GenerateSignToken(session) {
        /**
         * @REVIEW Change Signing LogicMake it more secure
         */
        let payload = {
            user: {
                _id: session.sid,
                type: session.userType,
                createdAt: session.createdTime,
                user_id: session.userID
            }
        };
        // Logger.Console(`payload ===> ${JSON.stringify(payload, undefined, 4)}`, 'info')
        try {
            let token = jwt.sign(payload, '', { algorithm: 'none' });
            let encryptedToken = Vault.Encrypt(token);
            return encryptedToken;
        }
        catch (error) {
            logger_1.Logger.Console("Error creating session");
            throw error;
        }
    }
    static hashPassword(password) {
        var _a;
        let salt = ((_a = app_1.Application.conf) === null || _a === void 0 ? void 0 : _a.ENCRYPTION.salt) || Vault.salt;
        let hash = pbkdf2_1.default.pbkdf2Sync(password, salt, 1, 32, 'sha256');
        return hash.toString('hex');
    }
}
exports.Vault = Vault;
//@TODO WHEN FETCHING SALT FROM Application.conf?.ENCRYPTION.salt IT IS GIVING UNDEFINED ERROR MAYBE BECAUSE WE ARE FETCHING THAT BEFORE INTIALIZATION
Vault.salt = 'HV0zH?l3ic+HdEArBJMm_:/1.i.s89ZS';
Vault.iv = 'wNgZIaiiY2Lx52TY';
//# sourceMappingURL=vault.js.map