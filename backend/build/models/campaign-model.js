"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignModel = void 0;
const gamesinn_database_1 = require("../databases/gamesinn-database");
const campaigns_history_1 = require("./campaigns-history");
class CampaignModel {
    static async INIT() {
        gamesinn_database_1.GamesInn.db.subscribe(async (val) => {
            this.db = val;
            if (val) {
                try {
                    this.collection = await this.db.createCollection('campaign');
                    console.log('GOT DB');
                    console.log(this.collection.collectionName);
                    await this.collection.createIndex({ "campaignCreatedAt": 1 }, { expireAfterSeconds: CampaignModel.campaignDeletedSeconds });
                }
                catch (error) {
                    if (error.code == 48) {
                        this.collection = await this.db.collection('campaign');
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
    static async InsertCampaign(data, user) {
        let todaysDate = new Date();
        let numberOfDaysToAdd = 3;
        let expiryDate = todaysDate.setDate(todaysDate.getDate() + numberOfDaysToAdd);
        try {
            let temp = {
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
            };
            CampaignModel.session = gamesinn_database_1.GamesInn.mongClient.startSession();
            // const transactionOptions: TransactionOptions = {
            //     // readPreference: ReadPreference.primary,
            //     readConcern: ReadConcern.fromOptions({ level: "local" }),
            //     writeConcern: WriteConcern.fromOptions({ w: "majority" })
            // };
            let doc;
            const transactionResult = await CampaignModel.session.withTransaction(async () => {
                doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName: temp.campaignName }, { $set: temp }, { upsert: true, session: CampaignModel.session });
                if (doc.lastErrorObject && !(doc.lastErrorObject.upserted)) {
                    await CampaignModel.session.abortTransaction();
                    console.error("campaign already exist with this name or userID");
                    console.error("Stopping Further Transaction");
                    return { success: false };
                }
                let object = { succes: true };
                let docCampaingHistory = await campaigns_history_1.CampaignHistoryModel.InsertCampaignHistory(data, user, CampaignModel.session);
                if ((doc).lastErrorObject && doc.lastErrorObject.upserted) {
                    temp._id = doc.lastErrorObject.upserted;
                    object.data = temp;
                    return object;
                }
                else {
                    object.data = doc.value;
                    return object;
                }
                ;
            });
            if (transactionResult === null || transactionResult === void 0 ? void 0 : transactionResult.success) {
                console.log("The reservation was successfully created.");
                return transactionResult.data;
            }
            else {
                console.log("The transaction was intentionally aborted.");
                return transactionResult.data = null;
            }
            // GamesInn.mongClient.startSession working
            // let doc = await this.collection.findOneAndUpdate({ userID: temp.userID, campainName:temp.campaignName }, { $set: temp }, { upsert: true })
        }
        catch (error) {
            console.log(error);
            console.log('Error in Inserting Campaign. The transaction was aborted due to an unexpected error');
            return error;
        }
        finally {
            await CampaignModel.session.endSession();
        }
    }
    static async FindCampaignByUserID(userID) {
        let doc = await this.collection.find({ userID: userID }).limit(1).toArray();
        return doc[0];
    }
}
exports.CampaignModel = CampaignModel;
CampaignModel.campaignDeletedSeconds = 259200;
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
//# sourceMappingURL=campaign-model.js.map