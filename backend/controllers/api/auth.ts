import express from "express";
import { Vault } from "../../databases/vault";
import { GamersModel } from "../../models/gamer-model";
import { JoiSchemas } from "../../utils/joiSchemas";


const routes = express.Router();

routes.post('/signupGamer', async (req, res) => {
    const payload = { ...req.body }
    //Joi validation
    let validation = JoiSchemas.SignUpValidator(payload)
    if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })
    //If email exist
    const gamer = await GamersModel.FindGamerByEmail(payload.email);
    if(gamer) return res.status(400).send({msg:"Gamer already exist"})
    //hash password
    payload.password = Vault.hashPassword(payload.password)
    
    //send token to email
    // save user into user collection
    //save otp token to otp collection




})