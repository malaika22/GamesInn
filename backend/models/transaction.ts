import mongodb, { Db, ReadConcern, ReadConcernLevel, ReadPreference, TransactionOptions, WriteConcern } from "mongodb";
import { GamesInn } from "../databases/gamesinn-database";
import { ObjectId } from "bson";
import { Session } from "./session-model";

interface TransactionResult {
    success: boolean,
    data?: any
}

export enum TransactionState {
    completed = "COMPLETED",
    pending = "PENDING"
}

interface TransactionCampaignFunded {
    campaignName: string,
    campaignID:ObjectId|String,
    campaignDays: number,
    userName: string,
    _id?: string | ObjectId,
    campaignCreatedBy: string,
    fundedBy: ObjectId | string
    fundedByuserEmail?: string,
    campaignCreatedUserEmail: string,
    currency: string,
    amount: Number,
    state: TransactionState,
    id?: String | ObjectId,
    token: String,
    transaction_createdAt: string,
    transaction_updatedAt: string,
    orderID: string,
    fundedUserName?: string,
    identifierToken: string
}


export abstract class TransactionsCampaignFunded {

    private static campaignDeletedSeconds = 259200


    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('transactions-campaign-funded');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 })

                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('transactions-campaign-funded');
                    } else {

                        console.log(error);
                        console.log('error in Creating Campaign Collection');
                    }
                }
            }
        });
    }

    /**
   * @Note : Follow Function is overide for initializing in Model.
   * Since Workers in node js doesn't share memory hence we initialize it again 
   */

    public static async INITWorker(db: Db) {
        if (!db) throw new Error('Unable to Initialize model in worker');
        this.db = db;
        try {

            this.collection = await this.db.collection('default');
        } catch (error) {
            throw new Error('Error in Initializing Collection in Worker')
        }
    }


    public static async InsertTransactionCampaignFunded(data: any) {

        try {

            let temp: TransactionCampaignFunded = {
                campaignName: data.campaignName,
                campaignDays: data.campaignDays,
                campaignCreatedBy: data.campaignCreatedBy,
                fundedBy: data.fundedBy,
                campaignCreatedUserEmail: data.campaignCreatedUserEmail,
                userName: data.userName,
                currency: data.currency,
                amount: data.amount,
                state: data.state,
                campaignID:data.campaignID,
                token: data.token,
                transaction_createdAt: data.transaction_createdAt,
                transaction_updatedAt: data.transaction_updatedAt,
                orderID: data.orderID,
                fundedUserName: data.fundedUserName,
                fundedByuserEmail: data.fundedByuserEmail,
                identifierToken: data.identifierToken,
            }

            let doc = await this.collection.findOneAndUpdate({ identifierToken: temp.identifierToken }, { $set: temp }, { upsert: true });

            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            } else return doc.value;

        } catch (error) {
            console.log(error);
            console.log('Error in InsertTransactionCampaignFunded');
            return error;
        }
    }

    public static async Add() {

        try {
            let doc = await this.collection.findOneAndUpdate({ name: 1 }, { $inc: { count: 1 } }, { upsert: true, returnDocument: 'after' });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            if (doc.lastErrorObject) return { count: 1 };
            return { count: (doc && doc.value) ? doc.value.count : 0 };
        } catch (error: any) {
            console.log(error);
            console.log('Error in Adding');
            throw new Error(error);
        }
    }



    public static async Sub() {

        try {

            let doc = await this.collection.findOneAndUpdate({ name: 1 }, { $inc: { count: -1 } }, { upsert: true });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            return { count: (doc && doc.value) ? doc.value.count : 0 };;
        } catch (error) {
            console.log(error);
            console.log('Error in substracting');
            return error;
        }
    }

    private static session: mongodb.ClientSession


    public static async FindAllAcitveCampaigns() {
        let doc: any = await this.collection.find({}).toArray()
        return doc
    }



    public static async FindCampaignByUserID(userID: string | ObjectId) {

        let doc: any = await this.collection.find({ userID: userID }).limit(1).toArray()
        return doc[0]
    }

}


