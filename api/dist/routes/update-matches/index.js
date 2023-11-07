"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchesRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const saveMatches = (0, express_1.Router)();
const updateMatchesRoute = () => saveMatches.post("/matches-update", async (req, res) => {
    const { id, sport, category, position, vacancies, club, description, city, state, block, date, startHour, endHour } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const existingUser = await users.findOne({ token: tokenUser });
    if (!existingUser) {
        res.status(400).json({ message: 'Usuário não encontrado.' });
        return;
    }
    const existingMatch = await matches.findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!existingMatch) {
        res.status(400).json({ message: "Partida não encontrada." });
        return;
    }
    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString()) !== existingMatch.user_id) {
        res.status(400).json({ message: "Usuário não autorizado." });
        return;
    }
    const query = { _id: new mongodb_1.ObjectId(id) };
    const update = {
        $set: {
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
        }
    };
    const result = await matches.updateOne(query, update);
    if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Dados salvos!" });
    }
    else {
        res.status(400).json({ message: "Falha ao atualizar a partida, nenhum dado foi alterado." });
    }
});
exports.updateMatchesRoute = updateMatchesRoute;
