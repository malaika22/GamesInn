import mongodb, { Db } from "mongodb";
import { GamesInn } from "../databases/gamesinn-database";
import { ObjectId } from "bson";
import { Campaign } from "./campaign-model";
import { Session } from "./session-model";


export abstract class CampaignHistoryModel {

    private static campaignDeletedSeconds = 259200


    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign-history');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "userID": 1 })
                    await this.collection.createIndex({ "campaignCreatedAt": 1 })
                    await this.collection.createIndex({ "campaignActive": 1 })


                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign-history');
                    } else {

                        console.log(error);
                        console.log('error in Creating Campaign History Collection');
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




    public static async InsertCampaignHistory(data: any, user: Session, session: mongodb.ClientSession) {
        try {

            let todaysDate = new Date();
            let numberOfDaysToAdd = 3;
            let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);
            console.log(new Date(expiryDate))



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



            let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName: temp.campaignName }, { $set: temp }, { upsert: true, session: session })


            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            } else return doc.value;

        }

        catch (error) {
            throw new Error('Error in insertingg campaign history')

        }

    }




    public static async FindCampaignByUserIDInHistory(userID: string | ObjectId) {

        let doc: any = await this.collection.find({ userID: userID }).limit(1).toArray()
        return doc[0]
    }

}