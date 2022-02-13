"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const vault_1 = require("../../databases/vault");
const accounts_1 = require("../../models/accounts");
const session_model_1 = require("../../models/session-model");
const userTypes_1 = require("../../utils/enums/userTypes");
const joiSchemas_1 = require("../../utils/joiSchemas");
const routes = express_1.default.Router();
let whitelistedRoutes = ['/allCampaigns', "/allActiveCampaigns"]; //dont need access token to run
let onlyGamerCanUtilize = ['/createAccount', '/myAccounts', '/getAccounts']; //only gamers are allowed to use these route
routes.use(async (req, res, next) => {
    try {
        if (whitelistedRoutes.includes(req.path))
            next();
        else {
            if (!req.headers.authorization)
                return res.status(401).send({ msg: "Please login" });
            const token = req.headers.authorization.toString().split(" ")[1];
            const payload = vault_1.Vault.DecodeSignToken(token);
            if (!payload)
                return res.status(400).send({ msg: "Login to access" });
            const session = await session_model_1.SessionsModel.GetSessionByID(payload.session_id, token);
            if (!session)
                return res.status(404).send({ msg: "Please login", issue: "Session not found with this token" });
            req.gamerDetails = session;
            next();
        }
    }
    catch (error) {
        console.log(error);
    }
});
routes.use((req, res, next) => {
    try {
        if (!req.gamerDetails)
            return next();
        if (onlyGamerCanUtilize.includes(req.path)) {
            if (req.gamerDetails.userType == userTypes_1.UserTypes.GAMER)
                next();
            else
                return res.status(401).send({ msg: "You cannot use this route" });
        }
        else
            return res.status(404).send('Unknown Route'); //will be chnaged when working on investor
    }
    catch (error) {
        console.log(error);
    }
});
routes.post('/createAccount', async (req, res) => {
    let payload = req.body;
    const validation = joiSchemas_1.JoiSchemas.CreateAccount(payload);
    if (validation.errored)
        return res.status(400).send({ msg: 'Validation errors', errors: validation.errors });
    payload.userEmail = req.gamerDetails.email;
    payload.userID = req.gamerDetails.userID;
    payload.username = req.gamerDetails.username;
    payload.accountActive = true;
    let doc = await accounts_1.AccountsModel.AddAccounts(payload);
    return res.status(201).send({ msg: "Success", doc });
});
routes.get('/myAccounts', async (req, res) => {
    let doc = await accounts_1.AccountsModel.GetMyAccounts(req.gamerDetails.userID);
    return res.status(200).send({ data: doc });
});
routes.get('/getAccounts', async (req, res) => {
    let doc = await accounts_1.AccountsModel.GetAllAccounts();
    return res.status(200).send({ data: doc });
});
exports.router = routes;
//# sourceMappingURL=accounts.js.map