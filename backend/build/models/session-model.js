"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsModel = void 0;
const bson_1 = require("bson");
const mongodb_1 = require("mongodb");
const gamesinn_database_1 = require("../databases/gamesinn-database");
// import { DefaultDatabase } from "../databases/database";
const vault_1 = require("../databases/vault");
const logger_1 = require("../server/logger");
const sentry_1 = require("../server/sentry");
class SessionsModel {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection("session");
                    console.log("GOT DB");
                    console.log(this.collection.collectionName);
                }
                catch (error) {
                    if (error.code == 48)
                        this.collection = await this.db.collection("session");
                    else {
                        sentry_1.Sentry.Error(error.toString(), 'Error in Creating Collection : session');
                        console.log(error);
                        console.log("error in Creating Collection");
                    }
                }
            }
        });
    }
    static async GetSessionByID(id, accessToken) {
        try {
            let doc = await this.collection.find({
                _id: new mongodb_1.ObjectId(id),
                accessToken: accessToken
            }).limit(1).toArray();
            console.log(doc, 'session doc');
            return (doc && doc.length) ? doc[0] : undefined;
        }
        catch (err) {
            logger_1.Logger.Console(`Error ==> ${JSON.stringify(err, undefined, 4)}`, "critical");
            throw err;
        }
    }
    static async InsertTestDoc() {
        try {
            let doc = await this.collection.insertOne({
                name: "Saad",
                date: new Date().toISOString(),
            });
            return doc;
        }
        catch (error) {
            console.log(error);
            console.log("Error in inserting");
            throw error;
        }
    }
    //Adding Session
    static async AddSession(user) {
        try {
            let sid = new bson_1.ObjectID();
            let temp = {
                _id: sid,
                type: user.type,
                createdTime: new Date().toISOString(),
                lastUpdatedTime: new Date().toISOString(),
                date: user.date,
                dob: user.dob || '',
                userID: user._id,
                name: user.name || user.username,
                username: user.name || user.username,
                number: user.number || '',
                countryCode: user.countryCode || '',
                createdAt: user.createdTime || user.createdTime || '',
                email: user.email || '',
                verified: user.verified || true, /** True because Guest User is Already Verified */
                // ffcount: (user as User).ffcount
            };
            temp.accessToken = vault_1.Vault.GenerateSignToken(temp);
            await this.collection.insertOne(temp);
            return temp;
        }
        catch (error) {
            console.log('Error in Addsession : ', error);
            throw error;
        }
    }
    static async getSessionByToken(token) {
        try {
            let doc = await this.collection.find({ accessToken: [token] });
            return doc;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async RemoveSessionAuthToken(email, accessToken) {
        try {
            let doc = await this.collection.findOneAndUpdate({ email }, { $pull: { accessToken: accessToken } }, { returnDocument: "after" });
            return doc;
        }
        catch (error) {
            logger_1.Logger.Console(`Error ==> ${JSON.stringify(error, undefined, 4)}`, "critical");
            throw error;
        }
    }
    static async getSessionByEmail(email) {
        try {
            let doc = await this.collection.findOne({ email });
            return doc;
        }
        catch (err) {
            logger_1.Logger.Console(`Error ==> ${JSON.stringify(err, undefined, 4)}`, "critical");
            throw err;
        }
    }
    //Deleting Session
    static async RemoveSession(email) {
        try {
            return await this.collection.findOneAndDelete({ email });
        }
        catch (error) {
            console.log("Error logging out ===> ", error);
            throw error;
        }
    }
    static async RemoveAllSessions(email) {
        let doc = await this.collection.deleteMany({ email: email });
        await doc;
    }
}
exports.SessionsModel = SessionsModel;
//# sourceMappingURL=session-model.js.map