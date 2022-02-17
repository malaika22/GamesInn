"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const transaction_1 = require("../../models/transaction");
const worker_manager_1 = require("../../utils/worker-manager");
const routes = express_1.default.Router();
routes.get('/test', async (req, res) => {
    // await RMQ.PublishMessageConfirm('smtp', { msg: 'registration-mail', data: { to: 'saad.ismail@cubixlabs.com', otp: 5455, subject: 'Verify Registration' } })
    try {
        // (new Array(1000).fill(1)).map((val, index) => {
        //     console.log('Index : ', index);
        //     RMQ.PublishMessageConfirm('fcm', { msg: 'stress-test', data: { somepayload: 'asdasdsadsadsadasd' } })
        // })
        // RMQ.PublishMessageConfirm('fcm', { msg: 'limit-test', data: { somepayload: 'asdasdsadsadsadasd' } })
        // console.log('testmail : ');
        res.send('Mail Sent');
    }
    catch (error) {
        console.log('error in testing Mail');
        res.status(200).send({ status: 'error' });
    }
});
routes.use("/stop", async (req, res) => {
    // await LeaguesDatabase.Disconnect();
    // HTTPServer.StopServer(true);
    res.send({ msg: "Stopping" });
    // process.kill(process.pid,'SIGINT')
    process.emit("SIGINT");
    //Kill The Process so that It will be restarted by PM2 or any other process manager
});
routes.get('/syncTest', async (req, res) => {
    try {
        await worker_manager_1.WorkerManager.StartWorker();
        return res.status(200).send({ msg: "done" });
    }
    catch (error) {
        let err = error;
        return res.status(500).send({ msg: err.toString() });
    }
});
/***
 * @Note Safe pay had no webhook in thier doc so we use toen method
 *@param token:string
 */
routes.post('/success_payment/:token', async (req, res) => {
    if (!req.params.token)
        return res.status(400).send({ msg: 'Send token for payment' });
    let doc = await transaction_1.TransactionsCampaignFunded.FindByIdentifierTokenAndUpdate(req.params.token, transaction_1.TransactionState.completed);
    if (!doc)
        return res.status(404).send({ msg: "No campaign found with this token" });
    return res.status(200).send({ msg: "Payment completed! " });
});
routes.use('*', (req, res) => { res.status(401).send('Uknown Router Default Handled'); });
exports.router = routes;
//# sourceMappingURL=default.js.map