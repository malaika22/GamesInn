import mongodb, { Db, MongoClient, MongoClientOptions } from "mongodb";
import { DBConfigMongo } from "../configs/database";
import { BehaviorSubject, Subscription } from "rxjs";
import { auditTime, debounceTime } from "rxjs/operators";
import { Logger } from "../server/logger";

export abstract class GamesInn {

    private static subscriptions: Subscription[] = [];
    public static mongClient: MongoClient;
    private static conf: DBConfigMongo;

    public static db: BehaviorSubject<Db | any> = new BehaviorSubject(undefined);


    public static async Connect(dbconf: DBConfigMongo) {
        try {

            GamesInn.conf = dbconf;

            if (!this.mongClient || !this.db) {
                // this.mongClient = await MongoClient.connect(`mongodb://${dbconf.host}:${dbconf.port}/replicaSet=rs`);
                // this.mongClient = await MongoClient.connect(`mongodb://${dbconf.host}:${dbconf.port}`);
                this.mongClient = await MongoClient.connect("mongodb://DESKTOP-TL59EP5:27017,DESKTOP-TL59EP5:27018,DESKTOP-TL59EP5:27019?replicaSet=rs");

                this.mongClient.on('serverDescriptionChanged', function (event) {
                    // console.log('received serverDescriptionChanged');
                    // console.log(JSON.stringify(event, null, 2));
                });


                this.mongClient.on('serverHeartbeatStarted', function (event) {
                    // console.log('received serverHeartbeatStarted');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('serverHeartbeatSucceeded', function (event) {
                    // console.log('received serverHeartbeatSucceeded');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('serverHeartbeatFailed', function (event) {
                    // console.log('received serverHeartbeatFailed');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('serverOpening', function (event) {
                    // console.log('received serverOpening');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('serverClosed', function (event) {
                    // console.log('received serverClosed');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on("close", function (event: any) {
                    // console.log('received close');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on("connectionClosed", function (event: any) {
                    // console.log('received Connection closed');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on("connectionCreated", function (event: any) {
                    // console.log('received Connection CREATED');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on("timeout", function (event: any) {
                    // console.log('received Timeout');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('topologyOpening', function (event) {
                    // console.log('received topologyOpening');
                    // console.log(JSON.stringify(event, null, 2));
                });

                this.mongClient.on('topologyClosed', function (event) {
                    // console.log('received topologyClosed');
                    // console.log(JSON.stringify(event, null, 2));
                });
                this.db.next(this.mongClient.db(dbconf.dbname));
                if (!this.db) this.mongClient.close();
            }
            return this.db.getValue();

        } catch (error: any) {
            console.log(error);
            console.log('error in Connecting Database');
            throw error;
        }


    }


    public static async Disconnect() {
        try {

            if (this.mongClient) this.mongClient.close();
        } catch (error) {
            Logger.Log(error, 'critical')
        }
    }

}