import { ObjectID } from "bson";
import mongodb, { Db, ObjectId } from "mongodb";
import { GamesInn } from "../databases/gamesinn-database";
// import { DefaultDatabase } from "../databases/database";
import { Vault } from "../databases/vault";
import { Logger } from "../server/logger";
import { Sentry } from "../server/sentry";


export interface User {
    _id?: ObjectId | string,
    name: string,
    dob: string,
    username:string,
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

interface Admin {
    _id?: ObjectId | string,
    name: string,
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
  // sid : ObjectID | string,
  accessToken?: Array<string> | string;
  userID: string;
  type: string;
  createdTime: string;
  lastUpdatedTime: string;
  date: string;
  dob: string;
  _id?: ObjectID | string;
  name: string;
  username: string;
  number: string;
  countryCode: string;
  createdAt: string;
  verified: boolean;
  email: string;
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
  public static async AddSession(user: User | Admin): Promise<Session> {

    try {

      let sid = new ObjectID();
      let temp: Session = {
        _id: sid,
        type: user.type,
        createdTime: new Date().toISOString(),
        lastUpdatedTime: new Date().toISOString(),
        date: user.date,
        dob: (user as User).dob || '',
        userID: (user._id as any),
        name: (user as User).name || (user as User).username,
        username: (user as User).name || (user as User).username,
        number: (user as User).number || '',
        countryCode: (user as User).countryCode || '',
        createdAt: (user as User).createdTime || (user as User).createdTime || '',
        email: (user as User).email || '',
        verified: (user as User).verified || true, /** True because Guest User is Already Verified */
        // ffcount: (user as User).ffcount
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
