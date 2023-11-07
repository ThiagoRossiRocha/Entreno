"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const getProfile = (0, express_1.Router)();
const getProfileRoute = () => getProfile.get("/profile", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const existingUser = await users.findOne({ token: tokenUser });
    const existingProfile = await profile.findOne({ user_id: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString() });
    const newProfile = {
        sport: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.sport,
        category: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.category,
        position: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.position,
        fullName: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.fullName,
        email: existingUser === null || existingUser === void 0 ? void 0 : existingUser.email,
        cpf: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.cpf,
        city: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.city,
        state: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.state,
        phoneNumber: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.phoneNumber,
    };
    res.status(200).json(newProfile);
});
exports.getProfileRoute = getProfileRoute;
