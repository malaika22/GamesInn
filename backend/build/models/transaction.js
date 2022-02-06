"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsCampaignFunded = exports.TransactionState = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
var TransactionState;
(function (TransactionState) {
    TransactionState["completed"] = "COMPLETED";
    TransactionState["pending"] = "PENDING";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
class TransactionsCampaignFunded {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('transactions-campaign-funded');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('transactions-campaign-funded');
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
    static async InsertTransactionCampaignFunded(data) {
        try {
            let temp = {
                campaignName: data.campaignName,
                campaignDays: data.campaignDays,
                campaignCreatedBy: data.campaignCreatedBy,
                fundedBy: data.fundedBy,
                campaignCreatedUserEmail: data.campaignCreatedUserEmail,
                userName: data.userName,
                currency: data.currency,
                amount: data.amount,
                state: data.state,
                campaignID: data.campaignID,
                token: data.token,
                transaction_createdAt: data.transaction_createdAt,
                transaction_updatedAt: data.transaction_updatedAt,
                orderID: data.orderID,
                fundedUserName: data.fundedUserName,
                fundedByuserEmail: data.fundedByuserEmail,
                identifierToken: data.identifierToken,
            };
            let doc = await this.collection.findOneAndUpdate({ identifierToken: temp.identifierToken }, { $set: temp }, { upsert: true });
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            }
            else
                return doc.value;
        }
        catch (error) {
            console.log(error);
            console.log('Error in InsertTransactionCampaignFunded');
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
    static async FindAllAcitveCampaigns() {
        let doc = await this.collection.find({}).toArray();
        return doc;
    }
    static async FindCampaignByUserID(userID) {
        let doc = await this.collection.find({ userID: userID }).limit(1).toArray();
        return doc[0];
    }
}
exports.TransactionsCampaignFunded = TransactionsCampaignFunded;
TransactionsCampaignFunded.campaignDeletedSeconds = 259200;
//# sourceMappingURL=transaction.js.map