import mongodb, {Db } from "mongodb";
import { DefaultDatabase } from "../databases/database";
import { Subscription } from 'rxjs';
import { GamesInn } from "../databases/gamesinn-database";
import { ObjectID, ObjectId } from "bson";
import { Session } from "./session-model";
import { date } from "joi";
import { CampaignHistoryModel } from "./campaigns-history";

export interface Campaign {
    campaignName: string,
    campaignDays: number,
    _id?: string | ObjectId,
    campaignCreatedBy: string,
    userID: ObjectId | string
    userEmail: string,
    userName: string,
    campaignCreatedAt: string | Date,
    campaignExpireAt: string | Date,
    campaignActive: boolean,
    campaignTargetedAmount: number,
    campaignDescription: string
}


export abstract class CampaignModel {

    private static campaignDeletedSeconds = 259200


    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 }, { expireAfterSeconds: CampaignModel.campaignDeletedSeconds })
                    
                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign');
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


    public static async InsertTestDoc() {

        try {

            let doc = await this.collection.insertOne({ 'name': 'Saad', date: new Date().toISOString() });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            return doc;
        } catch (error) {
            console.log(error);
            console.log('Error in inserting');
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

    public static async InsertCampaign(data: any, user: Session) {

        let todaysDate = new Date();
        let numberOfDaysToAdd = 3;
        let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);
        console.log(new Date(expiryDate))


        try {
            let temp: Campaign = {
                campaignActive: data.active,
                campaignName: data.campaignName,
                campaignCreatedAt: todaysDate,
                campaignDescription: data.campaignDescription,
                userEmail: user.email,
                userName: user.username,
                userID: user.userID,
                campaignDays: data.campaignDays,
                campaignTargetedAmount: data.campaignTargetedAmount,
                campaignCreatedBy: user.userID,
                campaignExpireAt: new Date(expiryDate)
            }

            // GamesInn.mongClient.startSession working
            // let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName:temp.campaignName }, { $set: temp }, { upsert: true })


            // if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
            //     temp._id = doc.lastErrorObject.upserted;
            //     return temp;
            // } else return doc.value;

        } catch (error) {
            console.log(error);
            console.log('Error in Inserting Campaign');
            return error;
        }
    }




    public static async FindCampaignByUserID(userID: string | ObjectId) {

        let doc: any = await this.collection.find({ userID: userID }).limit(1).toArray()
        return doc[0]
    }

}