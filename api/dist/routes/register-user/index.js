"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (0, express_1.Router)();
const registerUserRoute = () => createUser.post("/register", async (req, res) => {
    const { userName, email, password, createdAt } = req.body;
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ email } || { userName });
    if (existingUser) {
        res.status(400).json({ message: "Usuário já registrado" });
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = {
        userName,
        email,
        password: hashedPassword,
        createdAt,
    };
    const result = await users.insertOne(newUser);
    newUser._id = result.insertedId.toHexString();
    res.status(200).json({ message: "usuário registrado com sucesso!" });
});
exports.registerUserRoute = registerUserRoute;
