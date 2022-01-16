"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gamer_model_1 = require("../../models/gamer-model");
const routes = express_1.default.Router();
routes.post('/signupGamer', async (req, res) => {
    let payload = { ...req.body };
    gamer_model_1.GamersModel.InsertTestDoc();
});
//# sourceMappingURL=auth.js.map