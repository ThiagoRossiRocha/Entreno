"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getDotEnv_1 = require("../../util/getDotEnv");
const loginUser = (0, express_1.Router)();
const loginUserRoute = () => loginUser.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await mongo_1.MongoClient.db.collection('users');
        const user = await users.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Usuário não encontrado.' });
            return;
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Senha incorreta' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, getDotEnv_1.chaveSecreta);
        await users.updateOne({ email }, { $set: { token: token } });
        res.status(200).json({ token, message: 'Login bem-sucedido' });
    }
    catch (error) {
        res.status(401).json({ error: error });
    }
});
exports.loginUserRoute = loginUserRoute;
