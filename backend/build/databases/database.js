"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDatabase = void 0;
const mongodb_1 = require("mongodb");
const rxjs_1 = require("rxjs");
const logger_1 = require("../server/logger");
class DefaultDatabase {
    static async Connect(dbconf) {
        try {
            DefaultDatabase.conf = dbconf;
            if (!this.mongClient || !this.db) {
                this.mongClient = await mongodb_1.MongoClient.connect(`mongodb://DESKTOP-TL59EP5:27017,DESKTOP-TL59EP5:27018,DESKTOP-TL59EP5:27019?replicaSet=rs`);
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
                this.mongClient.on("close", function (event) {
                    // console.log('received close');
                    // console.log(JSON.stringify(event, null, 2));
                });
                this.mongClient.on("connectionClosed", function (event) {
                    // console.log('received Connection closed');
                    // console.log(JSON.stringify(event, null, 2));
                });
                this.mongClient.on("connectionCreated", function (event) {
                    // console.log('received Connection CREATED');
                    // console.log(JSON.stringify(event, null, 2));
                });
                this.mongClient.on("timeout", function (event) {
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
                if (!this.db)
                    this.mongClient.close();
            }
            return this.db.getValue();
        }
        catch (error) {
            console.log(error);
            console.log('error in Connecting Database');
            throw error;
        }
    }
    static async Disconnect() {
        try {
            if (this.mongClient)
                this.mongClient.close();
        }
        catch (error) {
            logger_1.Logger.Log(error, 'critical');
        }
    }
}
exports.DefaultDatabase = DefaultDatabase;
DefaultDatabase.subscriptions = [];
DefaultDatabase.db = new rxjs_1.BehaviorSubject(undefined);
//# sourceMappingURL=database.js.map