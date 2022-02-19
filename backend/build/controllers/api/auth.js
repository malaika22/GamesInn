"use strict";
/** @NOTE All Authentication apis will be avaliable here */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const vault_1 = require("../../databases/vault");
const gamer_model_1 = require("../../models/gamer-model");
const session_model_1 = require("../../models/session-model");
const tokens_model_1 = require("../../models/tokens-model");
const sentry_1 = require("../../server/sentry");
const email_1 = require("../../utils/email/email");
const joiSchemas_1 = require("../../utils/joiSchemas");
const utils_1 = require("../../utils/utils");
const routes = express_1.default.Router();
let whitelistedRoutes = ['/signupGamer', '/login', "/forgetPassword", '/resetPassword', '/userVerification', '/logout']; //dont need access token to run
let onlyGamerCanUtilize = ['/myAccounts', '/getAccounts']; //only gamers are allowed to use these route
let storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "profileImage")
            cb(null, 'uploads/userProfile');
        else if (file.fieldname == "accountImage")
            cb(null, 'uploads/account_images');
        else
            cb(null, 'Error uploading image');
        // file.fieldname == "accountImage" && cb(null, 'uploads/account_images');
    },
    filename: function (req, file, cb) {
        let ext = '';
        if (file.originalname.split('.').length > 1) {
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        }
        let fileName = `${crypto_1.default.randomBytes(64).toString()}-${Date.now()}${ext}`;
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});
const createUploadMiddleware = (options) => {
    const { fieldName, fileSize, diskStoragePath, max } = options;
    const multerStorage = diskStoragePath ? multer_1.default.diskStorage({ destination: diskStoragePath }) : multer_1.default.memoryStorage();
    let upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: filterAttachments,
        limits: { fileSize },
    });
    return upload;
};
const filterAttachments = (req, file, cb) => {
    if (!file.mimetype.match(/^(application\/pdf|image\/(jpeg|jpg|png|heic|heif))/)) {
        const uploadError = new Error();
        uploadError.name = 'invalidFileType';
        uploadError.message = 'Invalid file type';
        req.field = file.fieldname;
        req.file_error = `${uploadError.message} at ${req.field}`;
        return cb(null, false);
    }
    let ext = '';
    if (file.originalname.split('.').length > 1) {
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    }
    return cb(null, true);
};
let upload = createUploadMiddleware({ max: 6, fileSize: 2 * 100000 * 100000 });
routes.use(async (req, res, next) => {
    try {
        if (whitelistedRoutes.includes(req.path))
            next();
        else {
            if (!req.headers.authorization)
                return res.status(401).send({ msg: "Please login" });
            const token = req.headers.authorization.toString().split(" ")[1];
            const payload = vault_1.Vault.DecodeSignToken(token);
            if (!payload)
                return res.status(400).send({ msg: "Login to access" });
            const session = await session_model_1.SessionsModel.GetSessionByID(payload.session_id, token);
            if (!session)
                return res.status(404).send({ msg: "Please login", issue: "Session not found with this token" });
            req.gamerDetails = session;
            next();
        }
    }
    catch (error) {
        console.log(error);
    }
});
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
        //Hash password
        payload.password = vault_1.Vault.hashPassword(payload.password);
        //Save user into user collection
        payload.verification = false;
        let data = await gamer_model_1.GamersModel.CreateGamer(payload);
        //Create token and save it to db
        const token = utils_1.Utils.RandomStringGenerator();
        //save otp token to otp collection
        await tokens_model_1.TokenModel.InsertToken(token, tokens_model_1.Purposes.EMAIL_VERIFICATION, data === null || data === void 0 ? void 0 : data._id);
        //Send token to email
        const email = await email_1.Email.Shootmail(token);
        res.status(201).send({ msg: "Gamer created", data: data, previewURL: email.previewURL, token: token, });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
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
        if (!gamer.verified)
            return res.status(400).send({ msg: "User Not Verified" });
        //convert provided password into hash password and match if it's equal to hashed password saved in collection for respective user
        let passwordVerification = vault_1.Vault.VerifyHashedPassword(payload.password, gamer.password);
        if (!passwordVerification)
            return res.status(400).send({ msg: "Email or password is incorrect" });
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
routes.patch('/updateGamer', async (req, res) => {
    let payload = { ...req.body };
    const validation = joiSchemas_1.JoiSchemas.UpdateGamer(payload);
    if (validation.errored)
        return res.status(400).send({ msg: "Validation error", errors: validation.errors });
    let data = await gamer_model_1.GamersModel.UpdateGamerData({ _id: req.gamerDetails.userID, ...payload });
    res.status(200).send({ msg: 'Update suceesfully', data: data });
});
routes.patch('/profilePhoto', upload.any(), async (req, res) => {
    console.log(req.files);
    if (req.files.length > 1)
        return res.status(400).send({ msg: 'not more than 1 image is allowed' });
    req.files.forEach((object) => {
        object.showPath = `${global.Url}/images/${object.filename}`;
    });
    let data = await gamer_model_1.GamersModel.UpdateImage({ _id: req.gamerDetails.userID, profileImage: req.files[0] });
    return res.status(200).send({ msg: "update user", data });
});
routes.post('/forgetPassword', async (req, res) => {
    try {
        let payload = { ...req.body };
        //Validate if email is provided in req.body
        const validation = joiSchemas_1.JoiSchemas.EmailValidator(payload);
        if (validation.errored)
            return res.status(400).send({ msg: "Valdiation error", errors: validation.errors });
        //Check format of email
        if (!(utils_1.Utils.GenerateEmail(payload.email).checkEmail))
            return res.status(400).send({ msg: "Email format not okay!", success: false });
        //Find if gamer exist with this email
        let user = await gamer_model_1.GamersModel.FindGamerByEmail(payload.email);
        if (!user)
            return res.status(400).send({ msg: "No user found with this email" });
        //Generate Random Token
        const token = utils_1.Utils.RandomStringGenerator();
        console.log(token, 'HERE IS YOUR TOKEN');
        //Save it in database
        await tokens_model_1.TokenModel.InsertToken(token, tokens_model_1.Purposes.FORGOT_PASSWORD, user._id);
        //Shoot Email
        let emailData = await email_1.Email.Shootmail(token);
        //Send response
        return res.status(200).send({ msg: "Check your email", previewURL: emailData.previewURL, messageID: emailData.messageID, token: token, success: true });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in Forgot password');
        throw error;
    }
});
routes.patch('/resetPassword/:token', async (req, res) => {
    try {
        //Check Token if exist or not
        if (!req.params.token)
            return res.status(400).send({ msg: "Provide token" });
        const token = await tokens_model_1.TokenModel.FindToken(req.params.token);
        if (!token)
            return res.status(404).send({ msg: "No token found" });
        let payload = { ...req.body };
        //Check if passsword matches confrim password
        const validation = joiSchemas_1.JoiSchemas.UpdatePassword(payload);
        if (validation.errored)
            return res.status(400).send({ msg: "Validation error", errors: validation.errors });
        //Hash Password
        payload.password = vault_1.Vault.hashPassword(payload.password);
        //Update Passord in database
        await gamer_model_1.GamersModel.UpdateGamerPassword({ _id: token.userID, password: payload.password });
        //Send response
        return res.status(200).send({ msg: "Password Updated", success: true });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in Reset password');
        throw error;
    }
});
routes.get('/userVerification/:token', async (req, res) => {
    try {
        //Validate if token is provided as request paramseter
        if (!req.params.token)
            return res.status(400).send({ msg: "Provide token" });
        let token = await tokens_model_1.TokenModel.FindToken(req.params.token);
        //if no token send bad response
        if (!token)
            return res.status(404).send({ msg: "No token found" });
        //Update token and user data if provided correct token
        let promises = await Promise.all([tokens_model_1.TokenModel.UpdateToken(req.params.token), gamer_model_1.GamersModel.VerifyGamer(token.userID)]);
        return res.status(400).send({ msg: "user verfied", data: promises[1] });
    }
    catch (error) {
        console.log(error);
        sentry_1.Sentry.Error(error, 'Error in User Verification');
        throw error;
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