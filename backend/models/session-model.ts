import { ObjectID } from "bson";
import mongodb, { Db, ObjectId } from "mongodb";
import { GamesInn } from "../databases/gamesinn-database";
// import { DefaultDatabase } from "../databases/database";
import { Vault } from "../databases/vault";
import { Logger } from "../server/logger";
import { Sentry } from "../server/sentry";
import UserTypes from "../utils/enums/userTypes";
import { Gamer} from "./gamer-model";





interface Investor {
    _id?: ObjectId | string,
    username: string,
    // username:string,
    dob: string,
    countryCode: string,
    number: string,
    password?: string,
    email: string,
    verified: boolean,
    type: string,
    date: string
    createdTime?: string,
    lastUpdatedTime?: string,
    accessToken?: string
    userId?: string;
}


export interface Session {
  sid : ObjectID | string,
  accessToken?: Array<string> | string;
  userID: string;
  userType: string;
  createdTime: string;
  address:string;
  lastUpdatedTime: string;
  firstName: string;
  username: string;
  lastName:string;
  country: string;
  signupTime: string;
  verified: boolean;
  email: string;
  city:string

  // ffcount:Object
}

export abstract class SessionsModel {
  static db: Db;
  static collection: mongodb.Collection;

  public static async INIT() {
    GamesInn.db.subscribe(async (val) => {
      this.db = val;
      if (val) {
        try {

          this.collection = await this.db.createCollection("session");
          console.log("GOT DB");
          console.log(this.collection.collectionName);

        } catch (error: any) {

          if (error.code == 48) this.collection = await this.db.collection("session");
          else {

            Sentry.Error(error.toString(), 'Error in Creating Collection : session');

            console.log(error);
            console.log("error in Creating Collection");
          }
        }
      }
    });
  }

  public static async GetSessionByID(id: any, accessToken: string) {
    try {

        let doc = await this.collection.find({
            _id: new ObjectId(id),
            accessToken: accessToken
        }).limit(1).toArray();
        console.log(doc,'session doc');
        
        return (doc && doc.length) ? doc[0] : undefined;

    } catch (err) {
        Logger.Console(`Error ==> ${JSON.stringify(err, undefined, 4)}`, "critical");
        throw err;
    }
}

  public static async InsertTestDoc() {
    try {
      let doc = await this.collection.insertOne({
        name: "Saad",
        date: new Date().toISOString(),
      });

      return doc;

    } catch (error) {
      console.log(error);
      console.log("Error in inserting");
      throw error;
    }
  }

  //Adding Session
  public static async AddSession(user: Gamer | Investor): Promise<Session> {

    try {

      let sid = new ObjectID();
      let temp: Session = {
        sid: sid,
        userType: (user as Gamer).userType,
        createdTime: new Date().toISOString(),
        lastUpdatedTime: new Date().toISOString(),
        userID: (user._id as any),
        username: (user as Gamer).userName || (user as Investor).username,
        country: (user as Gamer).country || '',
        signupTime: (user as Gamer).createdTime || (user as Investor).createdTime || '',
        email: (user as Gamer).email || '',
        verified: (user as Gamer).verified || true, /** True because Guest Gamer is Already Verified */
        // ffcount: (user as Gamer).ffcount
        firstName:(user as Gamer ).firstName,
        lastName:(user as Gamer).lastName,
        city:(user as Gamer).city,
        address:(user as Gamer).address
      };
      temp.accessToken = Vault.GenerateSignToken(temp);

      await this.collection.insertOne(temp as any);

      return temp;

    } catch (error) {
      console.log('Error in Addsession : ', error);
      throw error;
    }

  }


  public static async getSessionByToken(token: string) {
    try {

      let doc = await this.collection.find({ accessToken: [token] });
      return doc;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public static async RemoveSessionAuthToken(email: string, accessToken: string) {
    try {

      let doc = await this.collection.findOneAndUpdate(
        { email },
        { $pull: { accessToken: accessToken } as mongodb.Document },
        { returnDocument: "after" });

      return doc;

    } catch (error) {

      Logger.Console(`Error ==> ${JSON.stringify(error, undefined, 4)}`, "critical");
      throw error;
    }
  }

  public static async getSessionByEmail(email: string) {
    try {

      let doc = await this.collection.findOne({ email });
      return doc;

    } catch (err) {
      Logger.Console(`Error ==> ${JSON.stringify(err, undefined, 4)}`, "critical");
      throw err;
    }
  }

  //Deleting Session
  public static async RemoveSession(email: string) {
    try {

      return await this.collection.findOneAndDelete({ email });

    } catch (error) {
      console.log("Error logging out ===> ", error);
      throw error;
    }
  }

  public static async RemoveAllSessions(email:string){
  let doc = await this.collection.deleteMany({email:email})
  await doc
 }
}
