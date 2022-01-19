import express from "express";
import Joi from "joi";
import { Document } from "mongodb";
import { Vault } from "../../databases/vault";
import { Gamer, GamersModel } from "../../models/gamer-model";
import { Session, SessionsModel } from "../../models/session-model";
import { Purposes, TokenModel } from "../../models/tokens-model";
import { Sentry } from "../../server/sentry";
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

        //hash password
        payload.password = Vault.hashPassword(payload.password)

        //send token to email

        // save user into user collection
        let data = await GamersModel.CreateGamer(payload)
        //save otp token to otp collection
        res.status(201).send({ msg: "Gamer created", data: data })
    } catch (error) {

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

        //convert provided password into hash password and match if it's equal to hashed password saved in collection for respective user
        let passwordVerification: boolean = Vault.VerifyHashedPassword(payload.password, gamer.password)
        if (!passwordVerification) return res.status(400).send({ msg: "Email or password is incorrect" })

        if (!gamer.verified) return res.status(400).send({ msg: "User Not Verified" });

        //Create gamer Session and send session as response
        let session: Session = await SessionsModel.AddSession(gamer as Gamer);

        res.status(200).send({ msg: 'Login succesfully', data: session })

    } catch (error:any) {
        console.log(error);
        Sentry.Error(error, 'Error in Login');
        throw error;
    }

})


routes.post('/forgetPassword', async (req, res) => {
  
    try {
        let payload = { ...req.body }

        const validation = JoiSchemas.EmailValidator(payload)
        if (validation.errored) return res.status(400).send({ msg: "Valdiation error", errors: validation.errors })

        if(!(Utils.GenerateEmail(payload.email).checkEmail)) return res.status(400).send({msg : "Email format not okay!", success:false})

        let user = await GamersModel.FindGamerByEmail(payload.email)
        if(!user) return res.status(400).send({msg : "No user found with this email"})

        const token = Utils.RandomStringGenerator()
  
        await TokenModel.InsertToken(token,Purposes.EMAIL_VERIFICATION,user._id )   
        return res.status(200).send({msg : "Check your email", success:true})

    } catch (error:any) {
        console.log(error);
        Sentry.Error(error, 'Error in Forgot password');
        throw error;
    }

})

routes.post('/resetPassword', (req, res) => {
    try {

    } catch (error:any) {

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