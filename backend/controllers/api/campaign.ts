/**
 * @Note These apis will be use to create Campagn. Assume i'm a gamer and i want funding, for that ive o start a campaign
 */

import express, { NextFunction, Router } from "express";
import { Vault } from "../../databases/vault";
import { SessionsModel } from "../../models/session-model";

const routes: Router = express.Router()

let whitelistedRoutes = ['/viewAllCampaigns' , 'createCampaign']

routes.use(async (req:any, res, next: NextFunction) => {
    try {
        if (whitelistedRoutes.includes(req.path)) next()
        else {
            if (!req.headers.authorization) return res.status(401).send({ msg: "Please login" })

            const token = req.headers.authorization.toString().split(" ")[1]
            
            const payload:any = Vault.DecodeSignToken(token)
            
            const session = await SessionsModel.GetSessionByID( payload.session_id,token)
    
            if(!session) return res.status(404).send({msg : "Please login", issue : "Session not found with this token"})
    
            req.gamerDetails = session
    
            next()
        } 
    } catch (error:any) {
        console.log(error);
        
    }



})

routes.get('/hello', (req:any, res) => {
    return res.status(200).send({ msg: req.gamerDetails })
})

routes.post('/createCampaign',(req,res)=>{
    let payload = {...req.body}
    


})





export const router = routes;

