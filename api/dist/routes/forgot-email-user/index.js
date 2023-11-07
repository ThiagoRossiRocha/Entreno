"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotEmailRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendRecoveryEmail_1 = __importDefault(require("./sendRecoveryEmail"));
const getDotEnv_1 = require("../../util/getDotEnv");
const user = (0, express_1.Router)();
const sendForgotEmailRoute = () => user.post("/forgot-email", async (req, res) => {
    const { email } = req.body;
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
        res.status(400).json({ message: "Usuário não registrado" });
        return;
    }
    const expiresIn = '1h';
    const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, getDotEnv_1.chaveSecreta, { expiresIn });
    (0, sendRecoveryEmail_1.default)(email, token);
    await users.updateOne({ email }, { $set: { tokenPassword: token } });
    res.status(200).json({ message: "Recuperação de email enviada com sucesso!" });
});
exports.sendForgotEmailRoute = sendForgotEmailRoute;
