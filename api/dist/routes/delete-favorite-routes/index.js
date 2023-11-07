"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMatchesFavoriteRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const deleteMatches = (0, express_1.Router)();
const deleteMatchesFavoriteRoute = () => deleteMatches.delete("/matches-favorite/:id", async (req, res) => {
    const tokenUser = req.headers.authorization;
    const id = req.params.id;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const favoriteMatch = await mongo_1.MongoClient.db.collection("favoriteMatch");
    await favoriteMatch.deleteOne({ match_id: id, user_id: userId });
    res.status(200).json({ message: "Dados deletados!" });
});
exports.deleteMatchesFavoriteRoute = deleteMatchesFavoriteRoute;
