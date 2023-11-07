"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNewPasswordRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saveUser = (0, express_1.Router)();
const saveNewPasswordRoute = () => saveUser.post("/reset-password", async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization;
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ tokenPassword: token });
    if (!existingUser) {
        res.status(400).json({ message: "Usuário não registrado" });
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await users.updateOne({ tokenPassword: token }, { $set: { password: hashedPassword, tokenPassword: "" } });
    res.status(200).json({ message: "Senha alterada com sucesso!" });
});
exports.saveNewPasswordRoute = saveNewPasswordRoute;
