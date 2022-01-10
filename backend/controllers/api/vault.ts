const express = require("express");
const routes = express.Router();
import { Application } from "../../app";
import { Vault } from "../../databases/vault";
import { Sentry } from "../../server/sentry";



routes.get("/get-vault-data", async (req: any, res: any) => {
  try {
    let data = await Vault.GetVaultData();
    res.status(200).send(data);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), "Error in get vault data");
  }
});



routes.get("/update-vault-data", async (req: any, res: any) => {
  try {
    let data: any = await Vault.UpdateVaultData();
    Application.conf = data;
    res.status(200).send(Application.conf);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), "Error in get updated vault data");
    console.log(error);
  }
});
export const router = routes;