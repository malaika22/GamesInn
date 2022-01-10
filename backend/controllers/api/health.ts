import express from "express";
import fs from "fs/promises";
import { DefaultDatabase } from "../../databases/database";
import { Vault } from "../../databases/vault";
import { Environment } from "../../interfaces/environment";
import { Sentry } from "../../server/sentry";


const routes = express.Router();

routes.use((req, res, next) => {
  //   console.log('Health Router Middleware');
  next();
});


//Always Use Default Routes at the End to ensure precedence
routes.get("/", async (req, res) => {
  /**
  * @TODO TAIMOOR
    @REVIEW
  * 1. Check DB Status
  * 2. Check Vault Status
  * 3. CircuitBreakStatus (Optional)
  *
  * If any error occurs sample respone will be
  * { db : false/true , vault : false/true, servicenameStatus : false/true }
  */
  try {
    let connectionObject = {
      db: { working: true, status: 200 },
      vault: { working: true, status: 200 },
    };
    let env = JSON.parse((await fs.readFile(global.__rootdir__ + `/environments/environment.json`)).toString());
    let result: any = await Vault.CheckConnection(env as Environment);

    if (result.response && result.response.statusCode) {
      connectionObject.vault.working = false;
      connectionObject.vault.status = result.response.statusCode;
    }

    if (DefaultDatabase.db.closed) {
      connectionObject.db.working = false;
      connectionObject.db.status = 500;
    }
    
  } catch (error) {
    let err: any = error
    console.log("Error end => ", err)
    Sentry.Error(err.toString(), "Error in Health check");
  }
});



export const router = routes;
//HEALTH CHECK IS USED FOR CONNECTION LIKES VAULT IS CONNECTED OR NOT, MONGODB, AWS ETC
//CIRCUIT BREAKER WILL BE USE TO CHECK CONNECTION AMONG SERVICE
//VAULT ROUTER WILL BE USE TO UPDATE VAULT CONFIGS
// console.log("checking initalization of vault", result.initialized); //check vault initalization
// console.log("novigdb connetion creating some issue?",NovigDatabase.db.closed); //check db connection
// if (!result.initialized) connectionObject.vault = false