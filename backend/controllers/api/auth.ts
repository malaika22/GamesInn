/** @NOTE All Authentication apis will be avaliable here */

import express from "express";
import { Document } from "mongodb";

import { Vault } from "../../databases/vault";
import { Gamer, GamersModel } from "../../models/gamer-model";
import { Session, SessionsModel } from "../../models/session-model";
import { Purposes, TokenModel } from "../../models/tokens-model";
import { Sentry } from "../../server/sentry";
import { Email } from "../../utils/email/email";
import { JoiSchemas } from "../../utils/joiSchemas";
import { Utils } from "../../utils/utils";


const routes = express.Router();

routes.post('/signupGamer', async (req, res) => {
    try {

        const payload = { ...req.body }
        //Joi validation
        let validation = JoiSchemas.SignUpValidator(payload)
        if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

        //If email exist
        const gamer = await GamersModel.FindGamerByEmail(payload.email);
        if (gamer) return res.status(400).send({ msg: "Gamer already exist" })

        //Hash password
        payload.password = Vault.hashPassword(payload.password)

        //Save user into user collection
        payload.verification = false
        let data = await GamersModel.CreateGamer(payload)


        //Create token and save it to db
        const token = Utils.RandomStringGenerator()

        //save otp token to otp collection
        await TokenModel.InsertToken(token, Purposes.EMAIL_VERIFICATION, data?._id)

        //Send token to email
        const email = await Email.Shootmail(token)

        res.status(201).send({ msg: "Gamer created", data: data, previewURL: email.previewURL, token: token, })
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }


})


routes.post('/login', async (req, res) => {

    try {
        const payload = { ...req.body }

        //validate if req.body all login required data
        const validation = JoiSchemas.LoginValidator(payload)
        if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

        //check if gamer exist with provided email
        const gamer: Document | null = await GamersModel.FindGamerByEmail(payload.email);
        if (!gamer) return res.status(400).send({ msg: "No gamer found with this email" })

        if (!gamer.verified) return res.status(400).send({ msg: "User Not Verified" });

       //convert provided password into hash password and match if it's equal to hashed password saved in collection for respective user
        let passwordVerification: boolean = Vault.VerifyHashedPassword(payload.password, gamer.password)
        if (!passwordVerification) return res.status(400).send({ msg: "Email or password is incorrect" })

        //Create gamer Session and send session as response
        let session: Session = await SessionsModel.AddSession(gamer as Gamer);

        res.status(200).send({ msg: 'Login succesfully', data: session })

    } catch (error: any) {
        console.log(error);
        Sentry.Error(error, 'Error in Login');
        throw error;
    }

})


routes.post('/forgetPassword', async (req, res) => {

    try {
        let payload = { ...req.body }

        //Validate if email is provided in req.body
        const validation = JoiSchemas.EmailValidator(payload)
        if (validation.errored) return res.status(400).send({ msg: "Valdiation error", errors: validation.errors })

        //Check format of email
        if (!(Utils.GenerateEmail(payload.email).checkEmail)) return res.status(400).send({ msg: "Email format not okay!", success: false })

        //Find if gamer exist with this email
        let user = await GamersModel.FindGamerByEmail(payload.email)
        if (!user) return res.status(400).send({ msg: "No user found with this email" })

        //Generate Random Token
        const token = Utils.RandomStringGenerator()

        console.log(token, 'HERE IS YOUR TOKEN')
        //Save it in database
        await TokenModel.InsertToken(token, Purposes.FORGOT_PASSWORD, user._id)

        //Shoot Email
        let emailData = await Email.Shootmail(token)

        //Send response
        return res.status(200).send({ msg: "Check your email", previewURL: emailData.previewURL, messageID: emailData.messageID, token: token, success: true })

    } catch (error: any) {
        console.log(error);
        Sentry.Error(error, 'Error in Forgot password');
        throw error;
    }

})


routes.patch('/resetPassword/:token', async (req, res) => {
    try {
        //Check Token if exist or not
        if (!req.params.token) return res.status(400).send({ msg: "Provide token" })
        const token = await TokenModel.FindToken(req.params.token)

        if (!token) return res.status(404).send({ msg: "No token found" })

        let payload = { ...req.body }

        //Check if passsword matches confrim password
        const validation = JoiSchemas.UpdatePassword(payload)
        if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

        //Hash Password
        payload.password = Vault.hashPassword(payload.password)

        //Update Passord in database
        await GamersModel.UpdateGamerPassword({ _id: token.userID, password: payload.password })

        //Send response
        return res.status(200).send({ msg: "Password Updated", success: true })

    } catch (error: any) {
        console.log(error);
        Sentry.Error(error, 'Error in Reset password');
        throw error;
    }
})



routes.get('/userVerification/:token', async (req, res) => {

    try {

        //Validate if token is provided as request paramseter
        if (!req.params.token) return res.status(400).send({ msg: "Provide token" })
        let token = await TokenModel.FindToken(req.params.token)

        //if no token send bad response
        if (!token) return res.status(404).send({ msg: "No token found" })

        //Update token and user data if provided correct token
        let promises = await Promise.all([TokenModel.UpdateToken(req.params.token), GamersModel.VerifyGamer(token.userID)])
        return res.status(400).send({ msg: "user verfied", data: promises[1] })

    } catch (error: any) {
        console.log(error);
        Sentry.Error(error, 'Error in User Verification');
        throw error;
    }
})


routes.post('/logout', async (req, res) => {

    try {
        let payload = { ...req.body };

        //validate logout
        let validation = JoiSchemas.LogoutValidator(payload)
        if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

        //remove session provided by clientside 
        let userSession: Document | null = await SessionsModel.RemoveSession(req.body.accessToken)

        //if no session access with provided token, Send below message
        if (userSession.value === null) return res.status(404).send({ msg: "Login again before logging out!" })

        return res.status(200).send({ msg: "Succesfully Logged out!!" })
    } catch (error) {

    }


})

export const router = routes;



// routes.post('/verifyAccesstoken', (req,res)=>{
//     const payload = { ...req.body }
//     console.log(Vault.DecodeSignToken(payload.token));
//     res.status(200).send({msg  : "done"})
// })

