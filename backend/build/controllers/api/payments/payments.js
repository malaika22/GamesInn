"use strict";
const express = require('express');
const Safepay = require('safepay');
const crypto = require('crypto');
const nanoid = require('nanoid');
var { ObjectId } = require('mongodb');
require("babel-register");
/***
 * @NOTE The require hook will bind itself to node's require and automatically compile files on the fly.
 */
const { Sentry } = require('../../../server/sentry');
const { GamersModel } = require('../../../models/gamer-model');
const { Vault } = require('../../../databases/vault');
const { CampaignModel } = require('../../../models/campaign-model');
const { TransactionsCampaignFunded } = require('../../../models/transaction');
const { SessionsModel } = require('../../../models/session-model');
const routes = express.Router();
let whitelistedRoutes = ['/allCampaigns', "/allActiveCampaigns"]; //dont need access token to run
// let onlyGamerCanUtilize = ['/createCampaign', "/myAllCampaigns", "/allCampaigns", '/allActiveCampaigns'] //only gamers are allowed to use these route
const config = {
    environment: "sandbox",
    sandbox: {
        baseUrl: "https://sandbox.api.getsafepay.com",
        apiKey: "sec_2d354429-fc07-4588-8b69-893c4825a002",
        apiSecret: "22ab92ea452241064823ba8767cfe8e2293e263a46337badb9e8c02ac1d7686d"
    },
};
routes.use(async (req, res, next) => {
    try {
        console.log('req started');
        if (whitelistedRoutes.includes(req.path))
            next();
        else {
            if (!req.headers.authorization)
                return res.status(401).send({ msg: "Please login" });
            const token = req.headers.authorization.toString().split(" ")[1];
            const payload = Vault.DecodeSignToken(token);
            if (!payload)
                return res.status(400).send({ msg: "Login to access" });
            const session = await SessionsModel.GetSessionByID(payload.session_id, token);
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
// const config = {
//   environment: "sandbox",
//   sandbox: {
//     baseUrl: Application.conf.SAFEPAY.BASE_URL,
//     apiKey:Application.conf.SAFEPAY.API_KEY,
//     apiSecret:Application.conf.SAFEPAY.API_SECRET
//   },
// }
let safePayObject = new Safepay(config);
routes.post('/payme', async (req, res) => {
    try {
        console.log(req.gamerDetails, "ghagagfagagag");
        //@NOTE CHECK BELOW CODE FOR HASHING STRING
        // var crypto = require('crypto');
        // var name = 'braitsch';
        // var hash = crypto.createHash('md5').update(name).digest('hex');
        // console.log(hash); // 9b74c9897bac770ffc029102a200c5de
        // initialize payment
        if (!(ObjectId.isValid(req.body.campaign_id)))
            return res.status(404).send({ msg: "provide valid campaign id" });
        let campaign = await CampaignModel.FindCampaignByID(req.body.campaign_id);
        if (!campaign)
            return res.status(404).send({ msg: "no such campaign found" });
        console.log(campaign, 'campaign');
        let { data } = await safePayObject.payments.create({
            amount: 1200,
            currency: "PKR",
        });
        //   interface TransactionCampaignFunded {
        //     campaignName: string,
        //     campaignDays: number,
        //     userName: string,
        //     _id?: string | ObjectId,
        //     campaignCreatedBy: string,
        //     fundedBy: ObjectId | string
        //     fundedByuserEmail?: string,
        //     campaignCreatedUserEmail: string,
        //     currency: string,
        //     amount: Number,
        //     state: TransactionState,
        //     token: String,
        //     transaction_createdAt: string,
        //     transaction_updatedAt: string,
        //     orderID: string,
        //     fundedUserName?: string,
        //     identifierToken: string
        // }
        let orderID = crypto.randomBytes(8).toString('hex');
        let identifierToken = crypto.randomBytes(8).toString('hex');
        console.log(data.data, '>>>Dtaa');
        let objectCreate = {
            campaignDays: campaign.campaignDays,
            campaignName: campaign.campainName,
            campaignCreatedBy: campaign.campaignCreatedBy,
            orderID: orderID,
            token: data.data.token,
            amount: data.data.amount,
            currency: data.data.currency,
            transaction_createdAt: data.data.created_at,
            transaction_updatedAt: data.data.updated_at,
            state: 'PENDING',
            identifierToken,
            fundedBy: req.gamerDetails.userID,
            fundedUserName: req.gamerDetails.username,
            fundedByuserEmail: req.gamerDetails.email,
            campaignID: campaign._id,
            campaignCreatedUserEmail: campaign.userEmail,
            userName: campaign.userName
        };
        await TransactionsCampaignFunded.InsertTransactionCampaignFunded(objectCreate);
        //Perform Chcekout
        let checkout = await safePayObject.checkout.create({
            tracker: data.data.token,
            orderId: orderID,
            source: "custom",
            cancelUrl: "https://example.com/payment-cancelled",
            redirectUrl: "https://example.com/payment-complete"
        });
        return res.status(200).redirect(checkout);
    }
    catch (error) {
        console.log(error);
        Sentry.Error(error, 'Error in Payment ');
        throw error;
    }
});
routes.post('/hitme', (req, res) => {
    console.log('GOt HIT');
    res.status(200).send('I worked');
});
module.exports = routes;
//   validate signature
function processPayment({ tracker, token, ref, sig, order_id }) {
    const valid = Safepay.validateWebhookSignature(tracker, sig, config.sandbox.apiSecret);
    if (!valid) {
        throw new Error("invalid payment signature. rejecting order...");
    }
    console.log("signature verified...");
    console.log("proceeding to mark order as paid");
}
// This is just for demostration purposes.
// In a real world scenario, Safepay will make
// a POST request with body encoded as a form.
// The params passed by Safepay to your server are:
// - tracker: this is the original tracker token for this payment
// - token: this is the transaction id
// - ref: this is the 6-digit transaction reference number
// - sig: signature returned by safepay to prove transaction integrity
//# sourceMappingURL=payments.js.map