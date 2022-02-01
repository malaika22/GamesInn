"use strict";
const express = require('express');
const Safepay = require('safepay');
const { Application } = require('../../../');
const { Vault } = require('../../../databases/vault');
const { Sentry } = require('../../../server/sentry');
let data = Vault.GetVaultData().then((data) => console.log("data =====>>>", data));
const routes = express.Router();
// const config = {
//   environment: "sandbox",
//   sandbox: {
//     baseUrl: "https://sandbox.api.getsafepay.com",
//     apiKey: "sec_2d354429-fc07-4588-8b69-893c4825a002",
//     apiSecret: "22ab92ea452241064823ba8767cfe8e2293e263a46337badb9e8c02ac1d7686d"
//   },
// }
const config = {
    environment: "sandbox",
    sandbox: {
        baseUrl: Application.conf.SAFEPAY.BASE_URL,
        apiKey: Application.conf.SAFEPAY.API_KEY,
        apiSecret: Application.conf.SAFEPAY.API_SECRET
    },
};
let safePayObject = new Safepay(config);
console.log(safePayObject, "=====>> safepay");
routes.get('/payme', async (req, res) => {
    try {
        // initialize payment
        let { data } = await safePayObject.payments.create({
            amount: 1200,
            currency: "PKR",
        });
        //Perform Chcekout
        let checkout = await safePayObject.checkout.create({
            tracker: data.data.token,
            orderId: "1234",
            source: "custom",
            cancelUrl: "https://example.com/payment-cancelled",
            redirectUrl: "https://example.com/payment-complete"
        });
        console.log(checkout, "===>> checkout");
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
//# sourceMappingURL=payments.js.map