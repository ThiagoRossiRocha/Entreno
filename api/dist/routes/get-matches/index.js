"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const getMatches = (0, express_1.Router)();
const getMatchesRoute = () => getMatches.get("/matches", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const acceptedMatch = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const existingMatches = await matches
        .find({ user_id: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString() })
        .sort({ date: 1 })
        .toArray();
    const listMatches = await Promise.all(existingMatches.map(async (objeto) => {
        const acceptedMatches = await acceptedMatch.findOne({ match_id: objeto === null || objeto === void 0 ? void 0 : objeto._id.toHexString() });
        function calculateEditMatches(acceptedMatches) {
            const numberOfPlayers = acceptedMatches === null || acceptedMatches === void 0 ? void 0 : acceptedMatches.players.length;
            if (numberOfPlayers === 1 || !numberOfPlayers)
                return true;
            else
                return false;
        }
        const newMatch = {
            id: objeto === null || objeto === void 0 ? void 0 : objeto._id.toHexString(),
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
            editMatches: calculateEditMatches(acceptedMatches),
        };
        return newMatch;
    }));
    res.status(200).json(listMatches);
});
exports.getMatchesRoute = getMatchesRoute;
