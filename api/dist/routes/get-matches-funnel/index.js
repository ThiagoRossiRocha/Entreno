"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesFunnelRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const getMatches = (0, express_1.Router)();
const getMatchesFunnelRoute = () => getMatches.get("/matches-funnel", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const sportFilter = req.headers.sportfilter;
    const categoryFilter = req.headers.categoryfilter;
    const cityFilter = req.headers.cityfilter;
    const stateFilter = req.headers.statefilter;
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const fixedMatches = await mongo_1.MongoClient.db.collection("favoriteMatch");
    const refusedMatches = await mongo_1.MongoClient.db.collection("refusedMatch");
    const acceptedMatches = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const userProfile = await profile.findOne({ user_id: userId });
    const existingMatchesFixed = await fixedMatches.find({ user_id: userId }).toArray();
    const existingMatchesRefused = await refusedMatches.find({ user_id: userId }).toArray();
    const existingMatchesAccepted = await acceptedMatches.find({ "players.userId": userId }).toArray();
    const existingMatchesNoVacanvies = await acceptedMatches.find({ remainingVacancies: 0 }).toArray();
    const existingMatchesFixedIds = existingMatchesFixed.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatchesRefusedIds = existingMatchesRefused.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatchesAcceptedIds = existingMatchesAccepted.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatchesNoVacanviesIds = existingMatchesNoVacanvies.map((id) => new mongodb_1.ObjectId(id.match_id));
    const existingMatches = await matches
        .find({
        _id: { $nin: [...existingMatchesFixedIds, ...existingMatchesRefusedIds, ...existingMatchesAcceptedIds, ...existingMatchesNoVacanviesIds] },
        user_id: { $ne: userId },
        sport: sportFilter || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.sport),
        category: categoryFilter || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.category),
        state: stateFilter || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.state),
        city: cityFilter || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.city)
    })
        .sort({ date: 1 })
        .toArray();
    const listMatches = existingMatches.map((objeto) => {
        const newMatch = {
            id: objeto === null || objeto === void 0 ? void 0 : objeto._id,
            sport: objeto === null || objeto === void 0 ? void 0 : objeto.sport,
            category: objeto === null || objeto === void 0 ? void 0 : objeto.category,
            position: objeto === null || objeto === void 0 ? void 0 : objeto.position,
            vacancies: objeto === null || objeto === void 0 ? void 0 : objeto.vacancies,
            description: objeto === null || objeto === void 0 ? void 0 : objeto.description,
            city: objeto === null || objeto === void 0 ? void 0 : objeto.city,
            state: objeto === null || objeto === void 0 ? void 0 : objeto.state,
            club: objeto === null || objeto === void 0 ? void 0 : objeto.club,
            block: objeto === null || objeto === void 0 ? void 0 : objeto.block,
            date: objeto === null || objeto === void 0 ? void 0 : objeto.date,
            startHour: objeto === null || objeto === void 0 ? void 0 : objeto.startHour,
            endHour: objeto === null || objeto === void 0 ? void 0 : objeto.endHour,
            profile_phoneNumber: objeto === null || objeto === void 0 ? void 0 : objeto.profile_phoneNumber,
        };
        return newMatch;
    });
    res.status(200).json(listMatches);
});
exports.getMatchesFunnelRoute = getMatchesFunnelRoute;
