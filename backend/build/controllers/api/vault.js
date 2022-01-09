"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
const routes = express.Router();
const app_1 = require("../../app");
const vault_1 = require("../../databases/vault");
const sentry_1 = require("../../server/sentry");
routes.get("/get-vault-data", async (req, res) => {
    try {
        let data = await vault_1.Vault.GetVaultData();
        res.status(200).send(data);
    }
    catch (error) {
        let err = error;
        sentry_1.Sentry.Error(err.toString(), "Error in get vault data");
    }
});
routes.get("/update-vault-data", async (req, res) => {
    try {
        let data = await vault_1.Vault.UpdateVaultData();
        app_1.Application.conf = data;
        res.status(200).send(app_1.Application.conf);
    }
    catch (error) {
        let err = error;
        sentry_1.Sentry.Error(err.toString(), "Error in get updated vault data");
        console.log(error);
    }
});
exports.router = routes;
//# sourceMappingURL=vault.js.map