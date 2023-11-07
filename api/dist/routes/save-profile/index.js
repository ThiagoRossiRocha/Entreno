"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProfileRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const saveProfile = (0, express_1.Router)();
const saveProfileRoute = () => saveProfile.post("/profile", async (req, res) => {
    const { sport, category, position, fullName, email, cpf, city, state, phoneNumber } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingUserInProfile = await profile.findOne({ user_id: userId });
    if (email !== (existingUser === null || existingUser === void 0 ? void 0 : existingUser.email)) {
        await users.updateOne({ token: tokenUser }, { $set: { email: email } });
    }
    const newProfile = {
        user_id: userId,
        sport,
        category,
        position,
        fullName,
        cpf,
        city,
        state,
        phoneNumber,
    };
    if (!existingUserInProfile) {
        await profile.insertOne(newProfile);
    }
    else {
        await profile.updateOne({ user_id: userId }, { $set: newProfile });
    }
    res.status(200).json({ message: "Dados salvos!" });
});
exports.saveProfileRoute = saveProfileRoute;
