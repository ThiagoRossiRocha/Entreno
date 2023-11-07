"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesFavoriteRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const getMatches = (0, express_1.Router)();
const getMatchesFavoriteRoute = () => getMatches.get("/matches-favorite", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const favoriteMatches = await mongo_1.MongoClient.db.collection("favoriteMatch");
    const refusedMatches = await mongo_1.MongoClient.db.collection("refusedMatch");
    const acceptedMatches = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingMatchesRefused = await refusedMatches.find({ user_id: userId }).toArray();
    const existingMatchesAccepted = await acceptedMatches.find({ "players.userId": userId }).toArray();
    const existingMatchesRefusedIds = existingMatchesRefused.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatchesAcceptedIds = existingMatchesAccepted.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatchesFavorite = await favoriteMatches
        .find({
        _id: { $nin: [...existingMatchesRefusedIds, ...existingMatchesAcceptedIds] },
        user_id: userId
    })
        .sort({ date: 1 })
        .toArray();
    const listMatches = await Promise.all(existingMatchesFavorite.map(async (objeto) => {
        const objectId = new mongodb_1.ObjectId(objeto.match_id);
        const match = await matches.findOne({ _id: objectId });
        const newMatch = {
            id: objeto.match_id,
            sport: match === null || match === void 0 ? void 0 : match.sport,
            category: match === null || match === void 0 ? void 0 : match.category,
            position: match === null || match === void 0 ? void 0 : match.position,
            vacancies: match === null || match === void 0 ? void 0 : match.vacancies,
            description: match === null || match === void 0 ? void 0 : match.description,
            city: match === null || match === void 0 ? void 0 : match.city,
            state: match === null || match === void 0 ? void 0 : match.state,
            club: match === null || match === void 0 ? void 0 : match.club,
            block: match === null || match === void 0 ? void 0 : match.block,
            date: match === null || match === void 0 ? void 0 : match.date,
            startHour: match === null || match === void 0 ? void 0 : match.startHour,
            endHour: match === null || match === void 0 ? void 0 : match.endHour,
            profile_phoneNumber: match === null || match === void 0 ? void 0 : match.profile_phoneNumber,
        };
        return newMatch;
    }));
    res.status(200).json(listMatches);
});
exports.getMatchesFavoriteRoute = getMatchesFavoriteRoute;
