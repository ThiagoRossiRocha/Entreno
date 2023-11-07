"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMatchExitRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const saveMatches = (0, express_1.Router)();
const saveMatchExitRoute = () => saveMatches.post("/matches-exit", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const { matchId } = req.body;
    const users = await mongo_1.MongoClient.db.collection("users");
    const acceptedMatches = await mongo_1.MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const filter = { "players.userId": userId, match_id: matchId };
    const update = { $pull: { players: { userId: userId } } };
    const result = await acceptedMatches.updateOne(filter, update);
    if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Dados removidos!" });
    }
    else {
        res.status(400).json({ message: "Jogador não encontrado na lista de jogadores." });
    }
});
exports.saveMatchExitRoute = saveMatchExitRoute;
