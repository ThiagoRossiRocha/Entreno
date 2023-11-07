"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageProfileRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const getImage = (0, express_1.Router)();
const getImageProfileRoute = () => getImage.get("/image-profile", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const existingUser = await users.findOne({ token: tokenUser });
    const existingProfile = await profile.findOne({ user_id: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString() });
    if (!(existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.image)) {
        return res.status(400).json({ message: "Imagem não encontrada." });
    }
    const binaryData = existingProfile.image;
    const imageBuffer = binaryData.buffer;
    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
});
exports.getImageProfileRoute = getImageProfileRoute;
