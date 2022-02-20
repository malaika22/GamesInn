"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const vault_1 = require("../../databases/vault");
const accounts_1 = require("../../models/accounts");
const session_model_1 = require("../../models/session-model");
const joiSchemas_1 = require("../../utils/joiSchemas");
const routes = express_1.default.Router();
let whitelistedRoutes = ['/allCampaigns', '/test', "/allActiveCampaigns"]; //dont need access token to run
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
routes.use((req, res, next) => {
    try {
        // if (!req.gamerDetails) return next()
        console.log('here auth');
        next();
    }
    catch (error) {
        console.log(error);
    }
});
routes.post('/createAccount', upload.any(), async (req, res) => {
    let payload = req.body;
    console.log(req.body);
    const validation = joiSchemas_1.JoiSchemas.CreateAccount(payload);
    if (validation.errored)
        return res.status(400).send({ msg: 'Validation errors', errors: validation.errors });
    req.files.forEach((object) => {
        delete object['originalname'];
        delete object['encoding'];
        delete object['size'];
        object.showPath = `${global.Url}/images/${object.filename}`;
    });
    const ranks = [
        "Bronze",
        "Silver",
        "Gold",
        "Platinium",
        "Diamond",
        "Heroic",
        "Grandmaster",
    ];
    const randomRank = Math.floor(Math.random() * ranks.length);
    const accountLevel = Math.floor(Math.random() * 100) + 1;
    const kdRatio = (Math.random() * 2.5).toFixed(2);
    const skins = [
        "Blue Flame Draco (AK)",
        "Unicorn’s Rage (Golden Era) (AK)",
        "VSS Vandal Revolt",
        "Megalodon Alpha (Scar)",
        "Duke Swallowtail (AWM)",
        "VSS Pink Love",
        "Climactic Red (M1014)",
        "M4A1 Griffin’s Fury",
        "Mechanical Girl",
        "CRAZY BUNNY MP40",
        "Red Megalodon Alpha SCAR",
        "Predatory Cobra MP40",
        "Green Flame Draco M1014",
        "Blood Moon SCAR",
        "Cupid SCAR",
        "Phantom Assassin SCAR",
        "Ultimate Titan SCAR",
        "Beast SCAR",
        "Playboy AWM",
        `Tagger's Revolt AWM`,
        "Duke Swallowtail AWM",
        `Valentine's AWM`,
        `Cheetah AWM`,
        "Bluesilk Royalty bundle",
        "Modern Mafia bundle",
        "Imperial Corps bundle",
        "Dunk Master bundle",
        "Breakdancer bundle",
        "Criminal bundle",
        "Sakura bundle",
        "Hip Hop bundle",
        "Winterland Male bundle",
        "Samurai bundle",
        "Bunny bundle",
        "Joker bundle",
        "Arctic Blue bundle",
        "Cobra Rage bundle",
        "Zombified Samurai Bundle",
        "Arctic blue bundle	",
        "Doctor red bundle",
        "Mystic Evil bundle",
        `King’s sword bundle`,
        `Bandit bundle`,
        `Night Clown bundle`,
        `The Street bundle`,
    ];
    const randomSkins = [];
    for (let i = 0; i < 5; i++) {
        const rdn = Math.floor(Math.random() * 45);
        randomSkins.push(skins[rdn]);
    }
    payload.randomRank = ranks[randomRank];
    payload.accountLevel = accountLevel;
    payload.kdRatio = kdRatio;
    payload.userEmail = req.gamerDetails.email;
    payload.createdBy = req.gamerDetails.userID;
    payload.username = req.gamerDetails.username;
    payload.isBought = false;
    payload.files = req.files;
    payload.randomSkins = randomSkins;
    payload.cost = parseFloat(req.body.cost);
    payload.description = req.body.description;
    payload.gamingAccount = req.body.gamingAccount;
    let doc = await accounts_1.AccountsModel.AddAccounts(payload);
    return res.status(201).send({ msg: "Success", doc });
});
routes.get('/myAccounts', async (req, res) => {
    let doc = await accounts_1.AccountsModel.GetMyAccounts(req.gamerDetails.userID);
    return res.status(200).send({ data: doc });
});
routes.get('/getAccounts', async (req, res) => {
    let doc = await accounts_1.AccountsModel.GetAllAccounts();
    return res.status(200).send({ data: doc });
});
exports.router = routes;
//# sourceMappingURL=accounts.js.map