"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = exports.Purposes = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
var Purposes;
(function (Purposes) {
    Purposes["EMAIL_VERIFICATION"] = "EMAIL_VERIFICATION";
    Purposes["FORGOT_PASSWORD"] = "FORGOT_PASSWORD";
})(Purposes = exports.Purposes || (exports.Purposes = {}));
class TokenModel {
    static async INIT() {
        console.log('init run ');
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('tokens');
                    // console.log(this.collection)
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    //@TODO TTl has been created but no document deletion
                    await this.collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 180 });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('tokens');
                    }
                    else {
                        console.log(error);
                        console.log('error in Creating Collection');
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
            this.collection = this.db.collection('gamers');
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
    /** Using this method to insert token */
    static async InsertToken(token, purpose, userID) {
        try {
            const temp = {
                userID: userID,
                purpose: purpose,
                used: false,
                createdAt: new Date(),
                timeToExpireSeconds: 180,
                token: token
            };
            let doc = await this.collection.findOneAndUpdate({ token: token }, { $set: temp }, { upsert: true });
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            }
            else
                return doc.value;
        }
        catch (error) {
            console.log(error);
            console.log('Error in inserting token');
            return error;
        }
    }
    static async FindToken(token) {
        let doc = await this.collection.find({ token: token, used: false }).limit(1).toArray();
        return doc[0];
    }
    static async UpdateToken(token) {
        let doc = await this.collection.findOneAndUpdate({ token: token, used: false }, { $set: { used: true } }, { returnDocument: "after" });
        return doc.value;
    }
}
exports.TokenModel = TokenModel;
//# sourceMappingURL=tokens-model.js.map