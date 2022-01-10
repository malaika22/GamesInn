"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const logger_1 = require("../configs/logger");
const logger_2 = require("../server/logger");
const defaultmodel_1 = require("../models/defaultmodel");
const sampleservice_1 = require("../services/sampleservice");
class SyncWorker {
    constructor(dbConf) {
        this.conf = dbConf;
    }
    async INIT() {
        try {
            await logger_2.Logger.CreateLogger(logger_1.LoggerConf.colors);
            let db = await this.Connect();
            if (db) {
                await defaultmodel_1.DefaultModel.INITWorker(db);
            }
            return;
        }
        catch (error) {
            let err = error;
            throw new Error(err.toString());
        }
    }
    async Connect() {
        try {
            this.conn = await mongodb_1.MongoClient.connect(`mongodb://${this.conf.host}:${this.conf.port}`);
            return this.conn.db(this.conf.dbname);
        }
        catch (error) {
            /**
             * @TODO Send Email on Crash
             */
            logger_2.Logger.Console(`Error in Syncing Matches Worker : ${JSON.stringify(error.toString())}`);
            return undefined;
        }
    }
    async SyncTest() {
        try {
            // let matches = await LeagueService.GetAllLeaguesForMatches()
            let leagues = await sampleservice_1.TestService.TestCall();
        }
        catch (error) {
            logger_2.Logger.Console(`Error===> ${error}`, 'critical');
            throw error;
            // res.status(400).send({ msg: error })
        }
    }
    async Dispose() {
        try {
            await this.conn.close();
        }
        catch (error) {
            logger_2.Logger.Console(error.toString());
            logger_2.Logger.Console('Error in Matches Worker when Disposing');
        }
    }
}
(async () => {
    if (!process.env.conf) {
        //TODO Generate Notifications
        console.log('Error in Initiliazing Worker, EMPTY DB CONFIG');
    }
    else {
        let conf = JSON.parse(process.env.conf);
        let worker = new SyncWorker(conf);
        try {
            await worker.INIT();
            await worker.SyncTest();
        }
        catch (error) {
            console.log('Error in Syncing Test Worker : ', error.toString());
        }
        finally {
            console.log('Finally called');
            await worker.Dispose();
            console.log('Worker Closed');
        }
    }
})();
//# sourceMappingURL=sync-matches.js.map