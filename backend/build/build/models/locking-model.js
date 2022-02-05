"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerLock = void 0;
const logger_1 = require("../server/logger");
const utils_1 = require("../utils/utils");
const database_1 = require("../databases/database");
/**
 *
  * @NOTE : Pessimistic Locking Applied
  * Following Model will change when Redis Will be applied and locks will be created on redis for high throughput
 */
class WorkerLock {
    static async INIT() {
        database_1.DefaultDatabase.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('plock');
                    this.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                }
                catch (error) {
                    let err = error;
                    if (err.code == 48) {
                        this.collection = await this.db.collection('plock');
                    }
                    else {
                        console.log(err);
                        console.log('error in Creating Collection');
                    }
                }
            }
        });
    }
    static async CreateLock(lockname) {
        try {
            // Logger.Console(`TeamID ==>  ${TeamID}`, 'info')
            let lock = {
                lockname: lockname,
                expiry: utils_1.Utils.GetFutureDate(300000, 'ms'),
                createdAt: new Date()
            };
            let doc = await this.collection.findOneAndUpdate({ lockname: lockname }, { $set: lock }, { upsert: true, returnDocument: "after" });
            // Logger.Console(`doc ===> ${doc}`, 'info')
            if (doc && doc.lastErrorObject && doc.lastErrorObject.upserted)
                return true;
            else
                return false;
        }
        catch (error) {
            let err = error;
            logger_1.Logger.Console(`Error===> ${err}`, 'critical');
            throw new Error(err);
        }
    }
    static async ReleaseLock(lockname) {
        try {
            let doc = await this.collection.findOneAndDelete({ lockname: lockname });
            return (doc && doc.ok) ? true : false;
        }
        catch (error) {
            let err = error;
            logger_1.Logger.Console(`Error===> ${err}`, 'critical');
            throw new Error(err);
        }
    }
    static async isLocked(lockname) {
        try {
            let doc = await this.collection.find({ lockname: lockname }).limit(1).toArray();
            return (doc && doc.length) ? true : false;
        }
        catch (error) {
            let err = error;
            logger_1.Logger.Console(`Error===> ${err}`, 'critical');
            throw new Error(err);
        }
    }
}
exports.WorkerLock = WorkerLock;
//# sourceMappingURL=locking-model.js.map