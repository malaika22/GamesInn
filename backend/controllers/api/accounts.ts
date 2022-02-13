import express, { NextFunction } from 'express'
import { Vault } from '../../databases/vault';
import { AccountsModel } from '../../models/accounts';
import { SessionsModel } from '../../models/session-model';
import { UserTypes } from '../../utils/enums/userTypes';
import { JoiSchemas } from '../../utils/joiSchemas';

const routes = express.Router();
let whitelistedRoutes = ['/allCampaigns', "/allActiveCampaigns"] //dont need access token to run
let onlyGamerCanUtilize = ['/createAccount', '/myAccounts', '/getAccounts'] //only gamers are allowed to use these route

routes.use(async (req: any, res, next: NextFunction) => {
    try {
        if (whitelistedRoutes.includes(req.path)) next()
        else {
            if (!req.headers.authorization) return res.status(401).send({ msg: "Please login" })

            const token = req.headers.authorization.toString().split(" ")[1]

            const payload: any = Vault.DecodeSignToken(token)
            if (!payload) return res.status(400).send({ msg: "Login to access" })

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
    try {
        if (!req.gamerDetails) return next()

        if (onlyGamerCanUtilize.includes(req.path)) {

            if (req.gamerDetails.userType == UserTypes.GAMER) next()
            else return res.status(401).send({ msg: "You cannot use this route" })
        }
        else return res.status(404).send('Unknown Route') //will be chnaged when working on investor
    } catch (error) {
        console.log(error);

    }
})


routes.post('/createAccount', async (req: any, res) => {
    let payload = req.body;

    const validation = JoiSchemas.CreateAccount(payload);
    if (validation.errored) return res.status(400).send({ msg: 'Validation errors', errors: validation.errors });

    payload.userEmail = req.gamerDetails.email;
    payload.userID = req.gamerDetails.userID;
    payload.username = req.gamerDetails.username
    payload.accountActive = true

    let doc = await AccountsModel.AddAccounts(payload)

    return res.status(201).send({ msg: "Success", doc })
});


routes.get('/myAccounts', async (req: any, res) => {
    let doc = await AccountsModel.GetMyAccounts(req.gamerDetails.userID);
    return res.status(200).send({ data: doc })

});

routes.get('/getAccounts', async (req: any, res) => {
    let doc = await AccountsModel.GetAllAccounts();
    return res.status(200).send({ data: doc })
})



export const router = routes;
