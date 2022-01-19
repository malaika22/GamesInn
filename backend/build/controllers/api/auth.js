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
const tokens_model_1 = require("../../models/tokens-model");
const sentry_1 = require("../../server/sentry");
const joiSchemas_1 = require("../../utils/joiSchemas");
const utils_1 = require("../../utils/utils");
const routes = express_1.default.Router();
routes.post('/signupGamer', async (req, res) => {
    try {
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
    }
    catch (error) {
    }
});
routes.post('/login', async (req, res) => {
    try {
        const payload = { ...req.body };
        //validate if req.body all login required data
        const validation = joiSchemas_1.JoiSchemas.LoginValidator(payload);
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
        //Create gamer Session and send session as response
        let session = await session_model_1.SessionsModel.AddSession(gamer);
        res.status(200).send({ msg: 'Login succesfully', data: session });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in Login');
        throw error;
    }
});
routes.post('/forgetPassword', async (req, res) => {
    try {
        let payload = { ...req.body };
        const validation = joiSchemas_1.JoiSchemas.EmailValidator(payload);
        if (validation.errored)
            return res.status(400).send({ msg: "Valdiation error", errors: validation.errors });
        if (!(utils_1.Utils.GenerateEmail(payload.email).checkEmail))
            return res.status(400).send({ msg: "Email format not okay!", success: false });
        let user = await gamer_model_1.GamersModel.FindGamerByEmail(payload.email);
        if (!user)
            return res.status(400).send({ msg: "No user found with this email" });
        const token = utils_1.Utils.RandomStringGenerator();
        await tokens_model_1.TokenModel.InsertToken(token, tokens_model_1.Purposes.EMAIL_VERIFICATION, user._id);
        return res.status(200).send({ msg: "Check your email", success: true });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in Forgot password');
        throw error;
    }
});
routes.post('/resetPassword', (req, res) => {
    try {
    }
    catch (error) {
    }
});
routes.post('/logout', async (req, res) => {
    try {
        let payload = { ...req.body };
        //validate logout
        let validation = joiSchemas_1.JoiSchemas.LogoutValidator(payload);
        if (validation.errored)
            return res.status(400).send({ msg: "Validation error", errors: validation.errors });
        //remove session provided by clientside 
        let userSession = await session_model_1.SessionsModel.RemoveSession(req.body.accessToken);
        //if no session access with provided token, Send below message
        if (userSession.value === null)
            return res.status(404).send({ msg: "Login again before logging out!" });
        return res.status(200).send({ msg: "Succesfully Logged out!!" });
    }
    catch (error) {
    }
});
exports.router = routes;
// routes.post('/verifyAccesstoken', (req,res)=>{
//     const payload = { ...req.body }
//     console.log(Vault.DecodeSignToken(payload.token));
//     res.status(200).send({msg  : "done"})
// })
//# sourceMappingURL=auth.js.map