"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPasswordRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const user = (0, express_1.Router)();
const getTokenPasswordRoute = () => user.get("/token-password", async (req, res) => {
    const tokenPassword = req.headers.authorization;
    if (!tokenPassword) {
        res.status(401).json({ message: "Token não fornecido" });
        return;
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ tokenPassword: tokenPassword });
    if (!existingUser) {
        res.status(401).json({ message: "token inválido" });
        return;
    }
    res.status(200).json({ message: "token válido" });
});
exports.getTokenPasswordRoute = getTokenPasswordRoute;
