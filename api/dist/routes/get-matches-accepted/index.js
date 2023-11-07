"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesAcceptedRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const getMatches = (0, express_1.Router)();
const getMatchesAcceptedRoute = () => getMatches.get("/matches-accepted", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const acceptedMatches = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingAcceptedMatch = await acceptedMatches.find({ "players.userId": userId }).toArray();
    const listMatches = await Promise.all(existingAcceptedMatch.map(async (objeto) => {
        const playerIds = objeto.players.map((player) => player.userId);
        const playerPromises = playerIds.map((playerId) => profile.findOne({ user_id: playerId }));
        const players = await Promise.all(playerPromises);
        const existingMatch = await matches.findOne({
            _id: new mongodb_1.ObjectId(objeto.match_id),
        });
        const newMatch = {
            match_id: objeto === null || objeto === void 0 ? void 0 : objeto.match_id,
            sport: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.sport,
            category: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.category,
            vacancies: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.vacancies,
            description: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.description,
            city: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.city,
            state: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.state,
            club: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.club,
            block: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.block,
            date: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.date,
            startHour: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.startHour,
            endHour: existingMatch === null || existingMatch === void 0 ? void 0 : existingMatch.endHour,
            user_id_owner: objeto === null || objeto === void 0 ? void 0 : objeto.user_id_owner,
            player1: players[0] ? {
                image: players[0].image,
                category: players[0].category,
                city: players[0].city,
                cpf: players[0].cpf,
                fullName: players[0].fullName,
                phoneNumber: players[0].phoneNumber,
                position: players[0].position,
                sport: players[0].sport,
                state: players[0].state,
                user_id: players[0].user_id,
            } : null,
            player2: players[1] ? {
                image: players[1].image,
                category: players[1].category,
                city: players[1].city,
                cpf: players[1].cpf,
                fullName: players[1].fullName,
                phoneNumber: players[1].phoneNumber,
                position: players[1].position,
                sport: players[1].sport,
                state: players[1].state,
                user_id: players[1].user_id,
            } : null,
            player3: players[2] ? {
                image: players[2].image,
                category: players[2].category,
                city: players[2].city,
                cpf: players[2].cpf,
                fullName: players[2].fullName,
                phoneNumber: players[2].phoneNumber,
                position: players[2].position,
                sport: players[2].sport,
                state: players[2].state,
                user_id: players[2].user_id,
            } : null,
            player4: players[3] ? {
                image: players[3].image,
                category: players[3].category,
                city: players[3].city,
                cpf: players[3].cpf,
                fullName: players[3].fullName,
                phoneNumber: players[3].phoneNumber,
                position: players[3].position,
                sport: players[3].sport,
                state: players[3].state,
                user_id: players[3].user_id,
            } : null,
            userIdToken: userId
        };
        return newMatch;
    }));
    res.status(200).json(listMatches);
});
exports.getMatchesAcceptedRoute = getMatchesAcceptedRoute;
