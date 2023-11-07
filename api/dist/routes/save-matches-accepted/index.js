"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchesAcceptedRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const saveMatches = (0, express_1.Router)();
const saveMatchesAcceptedRoute = () => saveMatches.post("/matches-accepted", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const { matchId } = req.body;
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const users = await mongo_1.MongoClient.db.collection("users");
    const acceptedMatch = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const favoriteMatch = await mongo_1.MongoClient.db.collection("favoriteMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const ownerMatchId = await matches.findOne({ _id: new mongodb_1.ObjectId(matchId) });
    const ownerMatchProfile = await profile.findOne({
        user_id: ownerMatchId === null || ownerMatchId === void 0 ? void 0 : ownerMatchId.user_id,
    });
    const existingMatchAndUserInAcceptedMatch = await acceptedMatch.findOne({
        match_id: matchId,
        user_id_owner: ownerMatchProfile === null || ownerMatchProfile === void 0 ? void 0 : ownerMatchProfile.user_id,
    });
    const vacancies = Number(ownerMatchId === null || ownerMatchId === void 0 ? void 0 : ownerMatchId.vacancies);
    const remainingVacancies = Number(ownerMatchId === null || ownerMatchId === void 0 ? void 0 : ownerMatchId.remainingVacancies);
    const existingAcceptedMatchesInFixedMatches = await favoriteMatch.findOne({
        match_id: matchId,
    });
    if (existingAcceptedMatchesInFixedMatches) {
        await favoriteMatch.deleteOne({ match_id: matchId, user_id: userId });
    }
    if (vacancies === 1 || vacancies === 2 || vacancies === 3) {
        if (!existingMatchAndUserInAcceptedMatch) {
            const newAcceptedMatch = {
                match_id: matchId,
                user_id_owner: ownerMatchProfile === null || ownerMatchProfile === void 0 ? void 0 : ownerMatchProfile.user_id,
                players: [{ userId: ownerMatchProfile === null || ownerMatchProfile === void 0 ? void 0 : ownerMatchProfile.user_id }, { userId }],
                remainingVacancies: vacancies - 1
            };
            await acceptedMatch.insertOne(newAcceptedMatch);
            return res.status(200).json({ message: "Dados salvos!" });
        }
        else {
            if (existingMatchAndUserInAcceptedMatch.players.length <= vacancies) {
                const newPlayer = { userId };
                await acceptedMatch.updateOne({ match_id: matchId, user_id_owner: ownerMatchProfile === null || ownerMatchProfile === void 0 ? void 0 : ownerMatchProfile.user_id }, { $push: { players: newPlayer } });
                const updatedRemainingVacancies = vacancies - existingMatchAndUserInAcceptedMatch.players.length;
                await acceptedMatch.updateOne({ match_id: matchId, user_id_owner: ownerMatchProfile === null || ownerMatchProfile === void 0 ? void 0 : ownerMatchProfile.user_id }, { $set: { remainingVacancies: updatedRemainingVacancies } });
                return res.status(200).json({ message: "Dados salvos!" });
            }
            else {
                return res.status(400).json({ message: "Vagas Insuficientes!" });
            }
        }
    }
});
exports.saveMatchesAcceptedRoute = saveMatchesAcceptedRoute;
