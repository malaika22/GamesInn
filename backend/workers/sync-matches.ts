import { Db, MongoClient } from "mongodb";
import { DBConfigMongo } from "../configs/database";
import { LoggerConf } from "../configs/logger";
import { Logger } from "../server/logger";
import { DefaultModel } from "../models/defaultmodel";
import { TestService } from "../services/sampleservice";


class SyncWorker {

    db!: Db
    conn!: MongoClient;
    conf: DBConfigMongo;
    constructor(dbConf: DBConfigMongo) {
     this.conf = dbConf;
    }

    public async INIT() {
        try {

            await Logger.CreateLogger(LoggerConf.colors);
            let db = await this.Connect();
            if (db) await DefaultModel.INITWorker(db);
            
            return;
        } catch (error) {
            let err: any = error;
            throw new Error(err.toString());
        }

    }

    private async Connect(): Promise<Db | undefined> {

        try {

            this.conn = await MongoClient.connect(`mongodb://${this.conf.host}:${this.conf.port}`);
            return this.conn.db(this.conf.dbname);

        } catch (error: any) {
            /**
             * @TODO Send Email on Crash
             */
            Logger.Console(`Error in Syncing Matches Worker : ${JSON.stringify(error.toString())}`);
            return undefined;
        }

    }

    public async SyncTest() {
        try {
            // let matches = await LeagueService.GetAllLeaguesForMatches()
            let leagues = await TestService.TestCall();

        } catch (error: any) {
            Logger.Console(`Error===> ${error}`, 'critical')
            throw error
            // res.status(400).send({ msg: error })
        }
    }

    public async Dispose() {

        try {


            await this.conn.close();

        } catch (error: any) {
            Logger.Console(error.toString());
            Logger.Console('Error in Matches Worker when Disposing');
        }


    }


}

(async () => {

    if (!process.env.conf) {
        //TODO Generate Notifications
        console.log('Error in Initiliazing Worker, EMPTY DB CONFIG');
    } else {
        let conf: DBConfigMongo = JSON.parse(process.env.conf as string);
        let worker = new SyncWorker(conf);
        try {



            await worker.INIT();
            await worker.SyncTest();

        } catch (error: any) {
            console.log('Error in Syncing Test Worker : ', error.toString());
        } finally {
            console.log('Finally called');
            await worker.Dispose();
            console.log('Worker Closed');
        }

    }
})();