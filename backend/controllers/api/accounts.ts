import express, { NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';

import { Vault } from '../../databases/vault';
import { AccountsModel } from '../../models/accounts';
import { SessionsModel } from '../../models/session-model';
import { UserTypes } from '../../utils/enums/userTypes';
import { JoiSchemas } from '../../utils/joiSchemas';

const routes = express.Router();
let whitelistedRoutes = ['/allCampaigns', '/test', "/allActiveCampaigns"] //dont need access token to run
let onlyGamerCanUtilize = [ '/myAccounts', '/getAccounts'] //only gamers are allowed to use these route


interface MiddlewareOptions {
    fieldName?: string;
    filter?: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;
    max: number;
    diskStoragePath?: string;
    fileSize?: number;
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname == "profileImage") cb(null, 'uploads/userProfile');
        else if(file.fieldname == "accountImage") cb(null, 'uploads/account_images');
        else cb(null,'Error uploading image')
        // file.fieldname == "accountImage" && cb(null, 'uploads/account_images');
    },
    filename: function (req, file, cb) {
        let ext = '';
        if (file.originalname.split('.').length > 1) {
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        }
        let fileName = `${crypto.randomBytes(64).toString()}-${Date.now()}${ext}`
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
});

const createUploadMiddleware = (options: MiddlewareOptions) => {
    const { fieldName, fileSize, diskStoragePath, max } = options;
    const multerStorage = diskStoragePath ? multer.diskStorage({ destination: diskStoragePath }) : multer.memoryStorage();
    let upload = multer({
        storage: storage,
        fileFilter: filterAttachments,
        limits: { fileSize },
    });
    return upload
}

const filterAttachments = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.match(/^(application\/pdf|image\/(jpeg|jpg|png|heic|heif))/)) {
        const uploadError = new Error();
        uploadError.name = 'invalidFileType';
        uploadError.message = 'Invalid file type';
        req.field = file.fieldname
        req.file_error = `${uploadError.message} at ${req.field}`;
        return cb(null, false);
    }
    let ext = ''
    if (file.originalname.split('.').length > 1) {
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    }
    return cb(null, true);
};

let upload = createUploadMiddleware({ max: 6, fileSize: 2 * 100000 * 100000 })


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
        // if (!req.gamerDetails) return next()
        console.log('here auth')
        next()
    } catch (error) {
        console.log(error);

    }
})




routes.post('/createAccount',upload.any(), async (req: any, res) => {
    let payload = req.body;
    console.log(req.body);
    const validation = JoiSchemas.CreateAccount(payload);
    if (validation.errored) return res.status(400).send({ msg: 'Validation errors', errors: validation.errors });

    (req.files as any).forEach((object:any) => {
        delete object['originalname'];
        delete object['encoding']
        delete object['size'];
        object.showPath = `${global.Url}/images/${object.filename}`
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
    payload.username = req.gamerDetails.username
    payload.isBought = false
    payload.files = req.files 
    payload.randomSkins =randomSkins;
    payload.cost = parseFloat(req.body.cost)
    payload.description = req.body.description;
    payload.gamingAccount = req.body.gamingAccount;


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
