/**
 * @Note These apis will be use to create Campagn. Assume i'm a gamer and i want funding, for that ive o start a campaign
 */

import express, { NextFunction, Router } from "express";

/**
 * @Note
 * The term "mutex" usually refers to a data structure used to synchronize concurrent processes running 
 * on different threads. For example, before accessing a non-threadsafe resource, a thread will lock the 
 * mutex. This is guaranteed to block the thread until no other thread holds a lock on the mutex and thus 
 * enforces exclusive access to the resource. Once the operation is complete, the thread releases the lock, 
 * allowing other threads to acquire a lock and access the resource.
 * 
 * @NOTE
 * To understand more about mutex read https://blog.theodo.com/2019/09/handle-race-conditions-in-nodejs-using-mutex/
 */
import { Mutex, MutexInterface } from 'async-mutex';

import { Vault } from "../../databases/vault";
import { SessionsModel } from "../../models/session-model";
import { UserTypes } from "../../utils/enums/userTypes";
import { CampaignModel } from "../../models/campaign-model";
import { JoiSchemas } from "../../utils/joiSchemas";
import { CampaignHistoryModel } from "../../models/campaigns-history";

const routes: Router = express.Router()
let lock: Map<string, MutexInterface>
lock = new Map()


let whitelistedRoutes = ['/viewAllCampaigns', 'createCampaign']
let onlyGamerCanUtilize = ['/createCampaign']
routes.use(async (req: any, res, next: NextFunction) => {
    try {
        if (whitelistedRoutes.includes(req.path)) next()
        else {
            if (!req.headers.authorization) return res.status(401).send({ msg: "Please login" })

            const token = req.headers.authorization.toString().split(" ")[1]

            const payload: any = Vault.DecodeSignToken(token)

            const session = await SessionsModel.GetSessionByID(payload.session_id, token)

            if (!session) return res.status(404).send({ msg: "Please login", issue: "Session not found with this token" })

            req.gamerDetails = session

            next()
        }
    } catch (error: any) {
        console.log(error);

    }

})


routes.use((req: any, res, next: NextFunction) => {
    if (onlyGamerCanUtilize.includes(req.path)) {
        if (req.gamerDetails.userType == UserTypes.GAMER) next()
        else return res.status(401).send({ msg: "You cannot use this route" })
    }

})

routes.get('/hello', (req: any, res) => {
    return res.status(200).send({ msg: req.gamerDetails })
})



routes.post('/createCampaign', async (req: any, res) => {
    let release: MutexInterface.Releaser | undefined
    try {
        if (!lock.has(req.gamerDetails.userID)) lock.set(req.gamerDetails.userID, new Mutex());


        release = await lock.get(req.gamerDetails.userID)?.acquire()
        let payload = { ...req.body }

        //Check if campaign exist by this user
        let campaign = await CampaignModel.FindCampaignByUserID(req.gamerDetails.userID)
        if (campaign) return res.status(400).send({ msg: "You've already created campaign, try after 3 days from the day you created campaign", success: false })

        //Create campaign if no campaing exist with a ttl of 3 days
        let validation = JoiSchemas.CreateCampaigns(payload)
        if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

        payload.active= true
        let campaignCreated = await CampaignModel.InsertCampaign(payload, req.gamerDetails)
        await CampaignHistoryModel.InsertCampaignHistory(payload,req.gamerDetails)

        return res.status(201).send({ msg: "Campaign Created", campaignData: campaignCreated })

    } catch (error) {

    }
    finally {
        if (release == undefined) return console.log('Release lock is undefined!')
        else {
            release()
            console.log('Your lock has been released!!!')
        }
    }


})





export const router = routes;

