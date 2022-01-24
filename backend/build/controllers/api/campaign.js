"use strict";
/**
 * @Note These apis will be use to create Campagn. Assume i'm a gamer and i want funding, for that ive o start a campaign
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const vault_1 = require("../../databases/vault");
const session_model_1 = require("../../models/session-model");
const routes = express_1.default.Router();
let whitelistedRoutes = ['/viewAllCampaigns', 'createCampaign'];
routes.use(async (req, res, next) => {
    try {
        if (whitelistedRoutes.includes(req.path))
            next();
        else {
            if (!req.headers.authorization)
                return res.status(401).send({ msg: "Please login" });
            const token = req.headers.authorization.toString().split(" ")[1];
            const payload = vault_1.Vault.DecodeSignToken(token);
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
routes.get('/hello', (req, res) => {
    return res.status(200).send({ msg: req.gamerDetails });
});
routes.post('/createCampaign', (req, res) => {
    let payload = { ...req.body };
});
exports.router = routes;
//# sourceMappingURL=campaign.js.map