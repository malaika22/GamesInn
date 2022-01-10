"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const usermodel_1 = require("../../models/usermodel");
const utils_1 = require("../../utils/utils");
const routes = express_1.default.Router();
routes.post('/123', async (req, res) => {
    try {
        await utils_1.Utils.Sleep(6000);
        let doc = await usermodel_1.GamersModel.InsertTestDoc();
        console.log('Test 123 Called ');
        res.send({ status: 123 });
    }
    catch (error) {
        console.log(error);
        console.log('error in 123');
        res.send({ status: error });
    }
});
routes.use('/stop', async (req, res) => {
    // await DefaultDatabase.Disconnect();
    // HTTPServer.StopServer(true);
    res.send({ msg: 'Stopping' });
    // process.kill(process.pid,'SIGINT')
    process.emit('SIGINT');
    //Kill The Process so that It will be restarted by PM2 or any other process manager
});
//Always Use Default Routes at the End to ensure precedence
// routes.use('/', async (req, res) => {
//     console.log('Test Default Called ');
//     await Utils.Sleep(10000);
//     res.send('Test Called'); 
//     console.log('Response Sent');
// });
exports.router = routes;
//# sourceMappingURL=test.js.map