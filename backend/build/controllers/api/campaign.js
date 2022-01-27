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
/**
 * @Note
 * The term "mutex" usually refers to a data structure used to synchronize concurrent processes running
 * on different threads. For example, before accessing a non-threadsafe resource, a thread will lock the
 * mutex. This is guaranteed to block the thread until no other thread holds a lock on the mutex and thus
 * enforces exclusive access to the resource. Once the operation is complete, the thread releases the lock,
 * allowing other threads to acquire a lock and access the resource.
 *
 * @NOTE
 * To understand more about mutex lock read https://blog.theodo.com/2019/09/handle-race-conditions-in-nodejs-using-mutex/
 */
const async_mutex_1 = require("async-mutex");
const vault_1 = require("../../databases/vault");
const session_model_1 = require("../../models/session-model");
const userTypes_1 = require("../../utils/enums/userTypes");
const campaign_model_1 = require("../../models/campaign-model");
const joiSchemas_1 = require("../../utils/joiSchemas");
const sentry_1 = require("../../server/sentry");
const routes = express_1.default.Router();
let lock;
lock = new Map();
let whitelistedRoutes = ['/viewAllCampaigns', 'createCampaign'];
let onlyGamerCanUtilize = ['/createCampaign'];
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
routes.use((req, res, next) => {
    if (onlyGamerCanUtilize.includes(req.path)) {
        if (req.gamerDetails.userType == userTypes_1.UserTypes.GAMER)
            next();
        else
            return res.status(401).send({ msg: "You cannot use this route" });
    }
});
routes.get('/hello', (req, res) => {
    return res.status(200).send({ msg: req.gamerDetails });
});
routes.post('/createCampaign', async (req, res) => {
    var _a;
    let release;
    try {
        if (!lock.has(req.gamerDetails.userID))
            lock.set(req.gamerDetails.userID, new async_mutex_1.Mutex());
        release = await ((_a = lock.get(req.gamerDetails.userID)) === null || _a === void 0 ? void 0 : _a.acquire());
        let payload = { ...req.body };
        //Check if campaign exist by this user
        let campaign = await campaign_model_1.CampaignModel.FindCampaignByUserID(req.gamerDetails.userID);
        if (campaign)
            return res.status(400).send({ msg: "You've already created campaign, try after 3 days from the day you created campaign", success: false });
        //Create campaign if no campaing exist with a ttl of 3 days
        let validation = joiSchemas_1.JoiSchemas.CreateCampaigns(payload);
        if (validation.errored)
            return res.status(400).send({ msg: "Validation error", errors: validation.errors });
        payload.active = true;
        let campaignCreated = await campaign_model_1.CampaignModel.InsertCampaign(payload, req.gamerDetails);
        // await CampaignHistoryModel.InsertCampaignHistory(payload,req.gamerDetails)
        return res.status(201).send({ msg: "Campaign Created", campaignData: campaignCreated });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in Create Campaign');
        throw error;
    }
    finally {
        if (release == undefined)
            return console.log('Release lock is undefined!');
        else {
            release();
            console.log('Your lock has been released!!!');
        }
    }
});
exports.router = routes;
//# sourceMappingURL=campaign.js.map