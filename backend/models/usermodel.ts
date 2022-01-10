import mongodb, { Db } from "mongodb";
import { Subscription } from 'rxjs';
import { GamesInn } from "../databases/gamesinn-database";

export abstract class GamersModel {

    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        console.log('init run ')
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('gamers');
                    console.log(this.collection)
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);

                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('gamers');
                    } else {

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

      public static async INITWorker(db: Db) {
        if (!db) throw new Error('Unable to Initialize model in worker');
        this.db = db;
        try {

            this.collection =  this.db.collection('gamers');
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
}