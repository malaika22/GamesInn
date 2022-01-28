const express = require('express')
const Safepay = require('safepay')

const { Vault } = require('../../../databases/vault')

const routes = express.Router()

const config = {
  environment: "sandbox",
  sandbox: {
    baseUrl: "https://sandbox.api.getsafepay.com",
    apiKey: "sec_2d354429-fc07-4588-8b69-893c4825a002",
    apiSecret: "22ab92ea452241064823ba8767cfe8e2293e263a46337badb9e8c02ac1d7686d"
  },

}

let safePayObject = new Safepay(config)

routes.get('/payme', async (req, res) => {
  try {
    console.log(safePayObject, "======> safePayObject")
    // initialize payment
    let { data } = await safePayObject.payments.create({
      amount: 1200,
      currency: "PKR",
    })

    console.log(data, "=====>> data");
    let checkout = await safePayObject.checkout.create({
      tracker: data.data.token,
      orderId: "1234",
      source: "custom",
      cancelUrl: "https://example.com/payment-cancelled",
      redirectUrl: "https://example.com/payment-complete"
    })

    console.log(checkout, "===>> checkout")
    // processPayment({
    //   tracker: "track_9cbb0da9-6500-4ece-903d-d29e21b4478a",
    //   token: "trans_89eedd54-459a-403b-a40a-a8f406e174ad",
    //   ref: "660425",
    //   sig: "58f5d2570715d44023b4e0d1b4d35045f719518e76bd560e1e419e4fe73df812"
    // })
    //   .then((response) => {
    //     return response.data
    //   }).then((data) => {
    //       console.log(data, 'data')
    //     return safePayObject.checkout.create({
    //       tracker: data.data.token,
    //       orderId: "1234",
    //       source: "custom",
    //       cancelUrl: "https://example.com/payment-cancelled",
    //       redirectUrl: "https://example.com/payment-complete"
    //     })
    //   }).then((url) => {
    //     console.log(url)
    //     return 
    //   }).catch((error) => {
    //     console.error(error)
    //   })


    return res.status(200).send({ msg: "WORKED!" })
  } catch (error) {
    console.log(error);
    Sentry.Error(error, 'Error in Payment ');
    throw error;

  }

})


module.exports = routes




// console.log(Safepay);

// // const config = {
// //     environment: "sandbox",
// //     sandbox: {
// //       baseUrl: "https://sandbox.api.getsafepay.com",
// //       apiKey: "sec_2d354429-fc07-4588-8b69-893c4825a002",
// //       apiSecret: "22ab92ea452241064823ba8767cfe8e2293e263a46337badb9e8c02ac1d7686d"
// //     },

// //   }

// //  let safePayObject = new Safepay(config)
// //  console.log(safePayObject , 'Safepay Object ')



//   validate signature
function processPayment({ tracker, token, ref, sig, order_id }) {
  const valid = Safepay.validateWebhookSignature(tracker, sig, config.sandbox.apiSecret)
  if (!valid) {
    throw new Error("invalid payment signature. rejecting order...")
  }

  console.log("signature verified...")
  console.log("proceeding to mark order as paid")
}


  // This is just for demostration purposes.
  // In a real world scenario, Safepay will make
  // a POST request with body encoded as a form.
  // The params passed by Safepay to your server are:
  // - tracker: this is the original tracker token for this payment
  // - token: this is the transaction id
  // - ref: this is the 6-digit transaction reference number
  // - sig: signature returned by safepay to prove transaction integrity
