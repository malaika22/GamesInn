
import mongodb, { Timestamp, Db, ObjectId } from "mongodb";
import { Subscription } from 'rxjs';
import { GamesInn } from "../databases/gamesinn-database";


export enum Purposes {
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
}

interface Token {
    _id?: string | ObjectId,
    token: string,
    createdAt: Date | string,
    purpose: Purposes,
    used: boolean,
    userID: string | ObjectId
    timeToExpireSeconds: string | number
}


export abstract class TokenModel {


    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        console.log('init run ')
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('tokens');
                    // console.log(this.collection)
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);

                    //@TODO TTl has been created but no document deletion
                    await this.collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60 })

                  

                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('tokens');
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

            this.collection = this.db.collection('gamers');
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

    /** Using this method to insert token */
    public static async InsertToken(token: string, purpose: Purposes, userID: string | ObjectId): Promise<any> {
        try {

            const temp: Token = {
                userID: userID,
                purpose: purpose,
                used: false,
                createdAt:  new Date(),
                timeToExpireSeconds: 180,
                token: token

            }

            let doc = await this.collection.findOneAndUpdate({ token: temp.token }, { $set: temp }, { upsert: true })
            if (doc.lastErrorObject && doc.lastErrorObject.upserted) {
                temp._id = doc.lastErrorObject.upserted;
                return temp;
            } else return doc.value;


        } catch (error) {
            console.log(error);
            console.log('Error in inserting token');
            return error;
        }
    }


    public static async FindToken(token:string)
    {
        let doc:any =  await this.collection.find({token:token, used:false}).limit(1).toArray()
        return doc[0]
    }

    public static async UpdateToken(token:string)
    {
      let doc = await this.collection.findOneAndUpdate({token:token , used:false}, {$set : {used:true}} ,{returnDocument:"after"} )
       return doc.value 
    }


}