"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamersModel = exports.UserTypes = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
var UserTypes;
(function (UserTypes) {
    UserTypes["GAMER"] = "Gamer";
    UserTypes["INVESTOR"] = "Investor";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
class GamersModel {
    static async INIT() {
        console.log('init run ');
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('gamers');
                    // console.log(this.collection)
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    this.collection.createIndex({ email: 1, createdTime: 1 });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('gamers');
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
    static async CreateGamer(data) {
        try {
            let temp = {
                userName: data.userName.trim(),
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                address: data.address.trim().toLocaleUpperCase(),
                password: data.password.trim(),
                city: data.city.trim(),
                country: data.country.trim(),
                email: data.email.trim(),
                userType: UserTypes.GAMER,
                verified: false,
                createdTime: new Date().toISOString()
            };
            let doc = await this.collection.findOneAndUpdate({ email: temp.email }, { $set: temp }, { upsert: true });
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            }
            else
                return doc.value;
        }
        catch (error) {
            console.log("Error in creating gamer ", error);
            throw error;
        }
    }
    static async FindGamerByEmail(email) {
        try {
            let gamer = await this.collection.find({ email: email }).limit(1).toArray();
            return gamer[0];
        }
        catch (error) {
            console.log("Error in gamer by email", error);
            throw error;
        }
    }
}
exports.GamersModel = GamersModel;
//# sourceMappingURL=gamer-model.js.map