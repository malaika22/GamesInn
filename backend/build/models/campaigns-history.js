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
            console.log(new Date(expiryDate));
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
        let doc = await this.collection.find({ userID: userID }).limit(1).toArray();
        return doc[0];
    }
}
exports.CampaignHistoryModel = CampaignHistoryModel;
CampaignHistoryModel.campaignDeletedSeconds = 259200;
//# sourceMappingURL=campaigns-history.js.map