"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const vault_1 = require("../../databases/vault");
const gamer_model_1 = require("../../models/gamer-model");
const session_model_1 = require("../../models/session-model");
const joiSchemas_1 = require("../../utils/joiSchemas");
const routes = express_1.default.Router();
routes.post('/signupGamer', async (req, res) => {
    const payload = { ...req.body };
    //Joi validation
    let validation = joiSchemas_1.JoiSchemas.SignUpValidator(payload);
    if (validation.errored)
        return res.status(400).send({ msg: "Validation error", errors: validation.errors });
    //If email exist
    const gamer = await gamer_model_1.GamersModel.FindGamerByEmail(payload.email);
    if (gamer)
        return res.status(400).send({ msg: "Gamer already exist" });
    //hash password
    payload.password = vault_1.Vault.hashPassword(payload.password);
    //send token to email
    // save user into user collection
    let data = await gamer_model_1.GamersModel.CreateGamer(payload);
    //save otp token to otp collection
    res.status(201).send({ msg: "Gamer created", data: data });
});
routes.post('/login', async (req, res) => {
    const payload = { ...req.body };
    //validate if req.body all login required data
    let validation = joiSchemas_1.JoiSchemas.LoginValidator(payload);
    if (validation.errored)
        return res.status(400).send({ msg: "Validation error", errors: validation.errors });
    //check if gamer exist with provided email
    const gamer = await gamer_model_1.GamersModel.FindGamerByEmail(payload.email);
    if (!gamer)
        return res.status(400).send({ msg: "No gamer found with this email" });
    //convert provided password into hash password and match if it's equal to hashed password saved in collection for respective user
    let passwordVerification = vault_1.Vault.VerifyHashedPassword(payload.password, gamer.password);
    if (!passwordVerification)
        return res.status(400).send({ msg: "Email or password is incorrect" });
    if (!gamer.verified)
        return res.status(400).send({ msg: "User Not Verified" });
    let session = await session_model_1.SessionsModel.AddSession(gamer);
    res.status(200).send({ msg: 'Login succesfully', data: session });
});
exports.router = routes;
//# sourceMappingURL=auth.js.map