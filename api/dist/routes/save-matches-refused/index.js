"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchesRefusedRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const saveMatches = (0, express_1.Router)();
const saveMatchesRefusedRoute = () => saveMatches.post("/matches-refused", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const { matchId } = req.body;
    const users = await mongo_1.MongoClient.db.collection("users");
    const refusedMatch = await mongo_1.MongoClient.db.collection("refusedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingMatchAndUserInRefusedMatch = await refusedMatch.findOne({ user_id: userId, match_id: matchId });
    const newRefusedMatch = {
        user_id: userId,
        match_id: matchId,
    };
    if (!existingMatchAndUserInRefusedMatch) {
        await refusedMatch.insertOne(newRefusedMatch);
        res.status(200).json({ message: "Dados salvos!" });
    }
    else {
        res.status(400).json({ message: "Partida já recusada!" });
    }
});
exports.saveMatchesRefusedRoute = saveMatchesRefusedRoute;
