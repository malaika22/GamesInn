import express from "express";
import { Document } from "mongodb";
import { Vault } from "../../databases/vault";
import { Gamer, GamersModel } from "../../models/gamer-model";
import { Session, SessionsModel } from "../../models/session-model";
import { JoiSchemas } from "../../utils/joiSchemas";


const routes = express.Router();

routes.post('/signupGamer', async (req, res) => {
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

})


routes.post('/login', async (req, res) => {

    const payload = { ...req.body }
    //validate if req.body all login required data
    let validation = JoiSchemas.LoginValidator(payload)
    if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

    //check if gamer exist with provided email
    const gamer:Document|null = await GamersModel.FindGamerByEmail(payload.email);
    if (!gamer) return res.status(400).send({ msg: "No gamer found with this email" })

    //convert provided password into hash password and match if it's equal to hashed password saved in collection for respective user
    let passwordVerification = Vault.VerifyHashedPassword( payload.password,gamer.password)
    if (!passwordVerification) return res.status(400).send({ msg: "Email or password is incorrect" })

    if (!gamer.verified) return res.status(400).send({ msg: "User Not Verified" });

    let session:Session = await SessionsModel.AddSession(gamer as Gamer);



    res.status(200).send({msg:'Login succesfully', data:session})

})


export const router = routes;