"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchesRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const saveMatches = (0, express_1.Router)();
const saveMatchesRoute = () => saveMatches.post("/matches", async (req, res) => {
    const { sport, category, position, vacancies, club, description, city, state, block, date, startHour, endHour } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingProfile = await profile.findOne({ user_id: userId });
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const newMatch = {
        user_id: userId,
        sport,
        category,
        position,
        vacancies,
        description,
        city,
        state,
        club,
        block,
        date,
        startHour,
        endHour,
        profile_phoneNumber: existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.phoneNumber,
    };
    await matches.insertOne(newMatch);
    res.status(200).json({ message: "Dados salvos!" });
});
exports.saveMatchesRoute = saveMatchesRoute;
