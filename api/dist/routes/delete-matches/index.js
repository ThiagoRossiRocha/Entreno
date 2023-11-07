"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMatchesRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const mongodb_1 = require("mongodb");
const deleteMatches = (0, express_1.Router)();
const deleteMatchesRoute = () => deleteMatches.delete("/matches/:id", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const id = req.params.id;
    const users = await mongo_1.MongoClient.db.collection("users");
    const matches = await mongo_1.MongoClient.db.collection("matches");
    const acceptedMatches = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    if (!existingUser) {
        res.status(400).json({ error: 'Usuário não encontrado.' });
        return;
    }
    const existingMatch = await matches.findOne({ _id: new mongodb_1.ObjectId(id) });
    const existingMatchInAcceptedMatch = await acceptedMatches.findOne({ match_id: id });
    if (!existingMatch) {
        res.status(400).json({ message: "Partida não encontrada." });
        return;
    }
    if (existingMatchInAcceptedMatch) {
        await acceptedMatches.deleteOne({ match_id: id });
    }
    await matches.deleteOne({ _id: new mongodb_1.ObjectId(id), user_id: userId });
    res.status(200).json({ message: "Dados deletados!" });
});
exports.deleteMatchesRoute = deleteMatchesRoute;
