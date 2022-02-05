"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const database_1 = require("../../databases/database");
const vault_1 = require("../../databases/vault");
const sentry_1 = require("../../server/sentry");
const routes = express_1.default.Router();
routes.use((req, res, next) => {
    //   console.log('Health Router Middleware');
    next();
});
//Always Use Default Routes at the End to ensure precedence
routes.get("/", async (req, res) => {
    /**
    * @TODO TAIMOOR
      @REVIEW
    * 1. Check DB Status
    * 2. Check Vault Status
    * 3. CircuitBreakStatus (Optional)
    *
    * If any error occurs sample respone will be
    * { db : false/true , vault : false/true, servicenameStatus : false/true }
    */
    try {
        let connectionObject = {
            db: { working: true, status: 200 },
            vault: { working: true, status: 200 },
        };
        let env = JSON.parse((await promises_1.default.readFile(global.__rootdir__ + `/environments/environment.json`)).toString());
        let result = await vault_1.Vault.CheckConnection(env);
        if (result.response && result.response.statusCode) {
            connectionObject.vault.working = false;
            connectionObject.vault.status = result.response.statusCode;
        }
        if (database_1.DefaultDatabase.db.closed) {
            connectionObject.db.working = false;
            connectionObject.db.status = 500;
        }
    }
    catch (error) {
        let err = error;
        console.log("Error end => ", err);
        sentry_1.Sentry.Error(err.toString(), "Error in Health check");
    }
});
exports.router = routes;
//# sourceMappingURL=health.js.map