import express from "express";
import { DefaultDatabase } from "../../databases/database";
import { DefaultModel } from "../../models/defaultmodel";
import { GamersModel } from "../../models/usermodel";
import { HTTPServer } from "../../server/http";
import { Utils } from "../../utils/utils";

const routes = express.Router();


routes.post('/123', async (req, res) => {
    try {

        await Utils.Sleep(6000)
        let doc = await GamersModel.InsertTestDoc();
        console.log('Test 123 Called ');
        res.send({ status: 123 });
    } catch (error) {
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
    process.emit(('SIGINT' as any));
    //Kill The Process so that It will be restarted by PM2 or any other process manager
});


//Always Use Default Routes at the End to ensure precedence
// routes.use('/', async (req, res) => {
//     console.log('Test Default Called ');
//     await Utils.Sleep(10000);
//     res.send('Test Called'); 
//     console.log('Response Sent');
// });

export const router = routes;