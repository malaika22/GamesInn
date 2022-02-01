"use strict";
const express = require('express');
const Safepay = require('safepay');
const { Application } = require('../../../app');
const { GamersModel } = require('../../../models/gamer-model');
const { Sentry } = require('../../../server/sentry');
// Application.INIT()
// let data = Vault.GetVaultData().then((data)=> console.log("data =====>>>", data))
const routes = express.Router();
const config = {
    environment: "sandbox",
    sandbox: {
        baseUrl: "https://sandbox.api.getsafepay.com",
        apiKey: "sec_2d354429-fc07-4588-8b69-893c4825a002",
        apiSecret: "22ab92ea452241064823ba8767cfe8e2293e263a46337badb9e8c02ac1d7686d"
    },
};
// const config = {
//   environment: "sandbox",
//   sandbox: {
//     baseUrl: Application.conf.SAFEPAY.BASE_URL,
//     apiKey:Application.conf.SAFEPAY.API_KEY,
//     apiSecret:Application.conf.SAFEPAY.API_SECRET
//   },
// }
let safePayObject = new Safepay(config);
console.log(safePayObject, "=====>> safepay");
routes.get('/payme', async (req, res) => {
    try {
        //@NOTE CHECK BELOW CODE FOR HASHING STRING
        // var crypto = require('crypto');
        // var name = 'braitsch';
        // var hash = crypto.createHash('md5').update(name).digest('hex');
        // console.log(hash); // 9b74c9897bac770ffc029102a200c5de
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
        console.log(data);
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
// This is just for demostration purposes.
// In a real world scenario, Safepay will make
// a POST request with body encoded as a form.
// The params passed by Safepay to your server are:
// - tracker: this is the original tracker token for this payment
// - token: this is the transaction id
// - ref: this is the 6-digit transaction reference number
// - sig: signature returned by safepay to prove transaction integrity
//# sourceMappingURL=payments.js.map