"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchesFavoriteRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const saveMatches = (0, express_1.Router)();
const saveMatchesFavoriteRoute = () => saveMatches.post("/matches-favorite", async (req, res) => {
    const { matchId } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const favoriteMatch = await mongo_1.MongoClient.db.collection("favoriteMatch");
    const existingMatchAndUserInFavoriteMatch = await favoriteMatch.findOne({ user_id: userId, match_id: matchId });
    const newFavoriteMatch = {
        user_id: userId,
        match_id: matchId
    };
    if (!existingMatchAndUserInFavoriteMatch) {
        await favoriteMatch.insertOne(newFavoriteMatch);
        res.status(200).json({ message: "Dados salvos!" });
    }
    else {
        res.status(400).json({ message: "Match já fixado!" });
    }
});
exports.saveMatchesFavoriteRoute = saveMatchesFavoriteRoute;
