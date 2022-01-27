import mongodb, { Db, ReadConcern, ReadConcernLevel, ReadPreference, TransactionOptions, WriteConcern } from "mongodb";
import { GamesInn } from "../databases/gamesinn-database";
import {  ObjectId } from "bson";
import { Session } from "./session-model";
import { CampaignHistoryModel } from "./campaigns-history";

interface TransactionResult{
    success:boolean,
    data?:any
}

export interface Campaign {
    campaignName: string,
    campaignDays: number,
    _id?: string | ObjectId,
    campaignCreatedBy: string,
    userID: ObjectId | string
    userEmail: string,
    userName: string,
    campaignCreatedAt: string | Date,
    campaignExpireAt: string | Date,
    campaignActive: boolean,
    campaignTargetedAmount: number,
    campaignDescription: string
}


export abstract class CampaignModel {

    private static campaignDeletedSeconds = 259200


    static db: Db;
    static collection: mongodb.Collection;

    public static async INIT() {
        GamesInn.db.subscribe(async (val: any) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 }, { expireAfterSeconds: CampaignModel.campaignDeletedSeconds })

                } catch (error: any) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign');
                    } else {

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

    public static async INITWorker(db: Db) {
        if (!db) throw new Error('Unable to Initialize model in worker');
        this.db = db;
        try {

            this.collection = await this.db.collection('default');
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

    private static session: mongodb.ClientSession
    public static async InsertCampaign(data: any, user: Session) {
        let todaysDate = new Date();
        let numberOfDaysToAdd = 3;
        let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);


        try {
            let temp: Campaign = {
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
            }

            CampaignModel.session = GamesInn.mongClient.startSession();


            const transactionOptions: TransactionOptions = {
                readPreference: ReadPreference.primary,
                readConcern: ReadConcern.fromOptions({ level: "local" }),
                writeConcern: WriteConcern.fromOptions({ w: "majority" })
            };

            let doc: mongodb.ModifyResult<mongodb.Document>
            let objectMe:any = {succes:true}

            const transactionResult:TransactionResult = await CampaignModel.session.withTransaction(async () => {
                doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName: temp.campaignName }, { $set: temp }, { upsert: true, session: CampaignModel.session },)
               
                if (doc.lastErrorObject && !(doc.lastErrorObject.upserted)) {
                    await CampaignModel.session.abortTransaction();
                    console.error("campaign already exist with this name or userID");
                    console.error("Stopping Further Transaction")
                    return { success: false };
                }
               
                await CampaignHistoryModel.InsertCampaignHistory(data, user, CampaignModel.session)
               
                if ((doc).lastErrorObject && doc.lastErrorObject.upserted) {
                    temp._id = doc.lastErrorObject.upserted;
                    objectMe.data = temp
                    return objectMe;
                } else{ 
                    objectMe.data = doc.value
                    return objectMe
                };
    
            }, transactionOptions)


            if (transactionResult) {
                console.log("The campaign was successfully created.");
                return transactionResult.data
            } else {

                console.log("The transaction was intentionally aborted.");
                return
            }
            // GamesInn.mongClient.startSession working
            // let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName:temp.campaignName }, { $set: temp }, { upsert: true })


      

        } catch (error) {
            console.log(error);
            console.log('Error in Inserting Campaign. The transaction was aborted due to an unexpected error');
            return error;
        }
        finally {
            await CampaignModel.session.endSession()
        }
    }


    public static async FindAllAcitveCampaigns()
    {
        let doc: any = await this.collection.find({ }).toArray()
        return doc
    }



    public static async FindCampaignByUserID(userID: string | ObjectId) {

        let doc: any = await this.collection.find({ userID: userID }).limit(1).toArray()
        return doc[0]
    }

}











// const transactionResults = await session.withTransaction(async () => {

//     // Important:: You must pass the session to each of the operations

//     // Add a reservation to the reservations array for the appropriate document in the users collection
//     const usersUpdateResults = await usersCollection.updateOne(
//         { email: userEmail },
//         { $addToSet: { reservations: reservation } },
//         { session });
//     console.log(`${usersUpdateResults.matchedCount} document(s) found in the users collection with the email address ${userEmail}.`);
//     console.log(`${usersUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);

//     // Check if the Airbnb listing is already reserved for those dates. If so, abort the transaction.
//     const isListingReservedResults = await listingsAndReviewsCollection.findOne(
//         { name: nameOfListing, datesReserved: { $in: reservationDates } },
//         { session });
//     if (isListingReservedResults) {
//         await session.abortTransaction();
//         console.error("This listing is already reserved for at least one of the given dates. The reservation could not be created.");
//         console.error("Any operations that already occurred as part of this transaction will be rolled back.")
//         return;
//     }

//     //  Add the reservation dates to the datesReserved array for the appropriate document in the listingsAndRewiews collection
//     const listingsAndReviewsUpdateResults = await listingsAndReviewsCollection.updateOne(
//         { name: nameOfListing },
//         { $addToSet: { datesReserved: { $each: reservationDates } } },
//         { session });
//     console.log(`${listingsAndReviewsUpdateResults.matchedCount} document(s) found in the listingsAndReviews collection with the name ${nameOfListing}.`);
//     console.log(`${listingsAndReviewsUpdateResults.modifiedCount} document(s) was/were updated to include the reservation dates.`);

// }, transactionOptions);

// if (transactionResults) {
//     console.log("The reservation was successfully created.");
// } else {
//     console.log("The transaction was intentionally aborted.");
// }