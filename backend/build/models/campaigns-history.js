"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignHistoryModel = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
class CampaignHistoryModel {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign-history');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "userID": 1 });
                    await this.collection.createIndex({ "campaignCreatedAt": 1 });
                    await this.collection.createIndex({ "campaignActive": 1 });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign-history');
                    }
                    else {
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
    static async InsertCampaignHistory(data, user, session) {
        try {
            let todaysDate = new Date();
            let numberOfDaysToAdd = 3;
            let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);
            //Didnt use todays date in campaignCreatedAt because dates are refrece types and expiry date has already change the value of todays date
            let temp = {
                campaignActive: data.active,
                campaignName: data.campaignName,
                campaignCreatedAt: new Date(),
                campaignDescription: data.campaignDescription,
                userEmail: user.email,
                userName: user.username,
                userID: user.userID,
                campaignDays: data.campaignDays,
                campaignTargetedAmount: data.campaignTargetedAmount,
                campaignCreatedBy: user.userID,
                campaignExpireAt: new Date(expiryDate)
            };
            let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName: temp.campaignName }, { $set: temp }, { upsert: true, session: session });
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            }
            else
                return doc.value;
        }
        catch (error) {
            throw new Error('Error in insertingg campaign history');
        }
    }
    static async FindCampaignByUserIDInHistory(userID) {
        let doc = await this.collection.find({ userID: userID }).toArray();
        return doc;
    }
    static async GetAllCampaigns() {
        let doc = await this.collection.find().toArray();
        return doc;
    }
    static async GetActiveCampaigns() {
        let doc = await this.collection.find({ campaignActive: true }).toArray();
        return doc;
    }
    static async DeactivateCampaigns(arrayOfIds) {
        try {
            if (arrayOfIds.length == 0)
                return "No doccument to update";
            let doc = await this.collection.updateMany({ _id: { $in: arrayOfIds } }, { $set: { campaignActive: false } });
            if (doc.modifiedCount > 0)
                return `modified count is ${doc.modifiedCount}`;
            // this.collection.find( { quantity: { $in: [ 5, 15 ] } }, { _id: 0 } )
        }
        catch (error) {
            throw new Error(`Error in insertingg campaign history ${error}`);
        }
    }
}
exports.CampaignHistoryModel = CampaignHistoryModel;
CampaignHistoryModel.campaignDeletedSeconds = 259200;
//# sourceMappingURL=campaigns-history.js.map