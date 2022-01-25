"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModel = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
class CampaignModel {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 }, { expireAfterSeconds: CampaignModel.campaignDeletedSeconds });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign');
                    }
                    else {
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
    static async INITWorker(db) {
        if (!db)
            throw new Error('Unable to Initialize model in worker');
        this.db = db;
        try {
            this.collection = await this.db.collection('default');
        }
        catch (error) {
            throw new Error('Error in Initializing Collection in Worker');
        }
    }
    static async InsertTestDoc() {
        try {
            let doc = await this.collection.insertOne({ 'name': 'Saad', date: new Date().toISOString() });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            return doc;
        }
        catch (error) {
            console.log(error);
            console.log('Error in inserting');
            return error;
        }
    }
    static async Add() {
        try {
            let doc = await this.collection.findOneAndUpdate({ name: 1 }, { $inc: { count: 1 } }, { upsert: true, returnDocument: 'after' });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            if (doc.lastErrorObject)
                return { count: 1 };
            return { count: (doc && doc.value) ? doc.value.count : 0 };
        }
        catch (error) {
            console.log(error);
            console.log('Error in Adding');
            throw new Error(error);
        }
    }
    static async Sub() {
        try {
            let doc = await this.collection.findOneAndUpdate({ name: 1 }, { $inc: { count: -1 } }, { upsert: true });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            return { count: (doc && doc.value) ? doc.value.count : 0 };
            ;
        }
        catch (error) {
            console.log(error);
            console.log('Error in substracting');
            return error;
        }
    }
    static async InsertCampaign(data, user) {
        let todaysDate = new Date();
        let numberOfDaysToAdd = 3;
        let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);
        console.log(new Date(expiryDate));
        try {
            let temp = {
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
            };
            // GamesInn.mongClient.startSession working
            // let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName:temp.campaignName }, { $set: temp }, { upsert: true })
            // if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
            //     temp._id = doc.lastErrorObject.upserted;
            //     return temp;
            // } else return doc.value;
        }
        catch (error) {
            console.log(error);
            console.log('Error in Inserting Campaign');
            return error;
        }
    }
    static async FindCampaignByUserID(userID) {
        let doc = await this.collection.find({ userID: userID }).limit(1).toArray();
        return doc[0];
    }
}
exports.CampaignModel = CampaignModel;
CampaignModel.campaignDeletedSeconds = 259200;
//# sourceMappingURL=campaign-model.js.map