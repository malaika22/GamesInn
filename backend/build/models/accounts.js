"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModel = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
class AccountsModel {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('accounts');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('accounts');
                    }
                    else {
                        console.log(error);
                        console.log('error in Creating Accounts Collection');
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
            this.collection = await this.db.collection('accounts');
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
    static async AddAccounts(data) {
        try {
            let temp = {
                username: data.username,
                accountName: data.accountName,
                accountCreatedAt: new Date(),
                isBought: false,
                userEmail: data.userEmail,
                createdBy: data.createdBy,
                cost: data.cost,
                images: data.files,
                skins: data.randomSkins,
                rank: data.randomRank,
                kdRatio: data.kdRatio,
                accountLevel: data.accountLevel,
                description: data.description,
                gamingAccount: data.gamingAccount,
                title: data.title
            };
            let doc = await this.collection.findOneAndUpdate({ accountName: data.accountName, userID: temp.createdBy }, { $set: temp }, { upsert: true, returnDocument: 'after' });
            // if (doc && doc.insertedCount) return doc.result;
            // else return doc;
            console.log(doc);
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            }
            else
                return doc.value;
        }
        catch (error) {
            console.log(error);
            console.log('Error in creating acccount');
            throw new Error(error);
        }
    }
    static async GetMyAccounts(userID) {
        let doc = await this.collection.find({ userID: userID }).toArray();
        return doc;
    }
    static async GetAllAccounts() {
        let doc = await this.collection.find({}).toArray();
        return doc;
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
}
exports.AccountsModel = AccountsModel;
//# sourceMappingURL=accounts.js.map