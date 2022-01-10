import mongodb, { Db } from "mongodb";
import { Logger } from "../server/logger";
import { Utils } from "../utils/utils";
import { DefaultDatabase } from "../databases/database";



export interface WorkerLock {

    lockname: string;
    expiry: Date;
    createdAt: Date;
    [key: string]: any;
}

/**
 * 
  * @NOTE : Pessimistic Locking Applied
  * Following Model will change when Redis Will be applied and locks will be created on redis for high throughput
 */
export abstract class WorkerLock {

    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        DefaultDatabase.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('plock');
                    this.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);

                } catch (error) {
                    let err: any = error;
                    if (err.code == 48) {
                        this.collection = await this.db.collection('plock');
                    } else {

                        console.log(err);
                        console.log('error in Creating Collection');
                    }
                }
            }
        });
    }

    public static async CreateLock(lockname: string) {
        try {
            // Logger.Console(`TeamID ==>  ${TeamID}`, 'info')
            let lock: WorkerLock = {
                lockname: lockname,
                expiry: Utils.GetFutureDate(300000, 'ms'),
                createdAt: new Date()
            }
            let doc = await this.collection.findOneAndUpdate(
                { lockname: lockname },
                { $set: lock },
                { upsert: true, returnDocument: "after" });
            // Logger.Console(`doc ===> ${doc}`, 'info')
            if (doc && doc.lastErrorObject && doc.lastErrorObject.upserted) return true;
            else return false;

        } catch (error) {
            let err: any = error;
            Logger.Console(`Error===> ${err}`, 'critical')
            throw new Error(err)
        }
    }

    public static async ReleaseLock(lockname: String) {
        try {

            let doc = await this.collection.findOneAndDelete({ lockname: lockname });
            return (doc && doc.ok) ? true : false;
        } catch (error) {
            let err: any = error;
            Logger.Console(`Error===> ${err}`, 'critical')
            throw new Error(err)
        }
    }

    public static async isLocked(lockname: String) {
        try {

            let doc = await this.collection.find({ lockname: lockname }).limit(1).toArray();

            return (doc && doc.length) ? true : false;
        } catch (error) {
            let err: any = error;
            Logger.Console(`Error===> ${err}`, 'critical')
            throw new Error(err)
        }
    }








}