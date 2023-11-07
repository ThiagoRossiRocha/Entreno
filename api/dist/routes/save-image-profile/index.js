"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImageProfileRoute = void 0;
const express_1 = require("express");
const mongo_1 = require("../../db/mongo");
const multer_1 = __importDefault(require("multer"));
const saveImage = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const saveImageProfileRoute = () => saveImage.post("/image-profile", upload.single("croppedImage"), async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await mongo_1.MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const profile = await mongo_1.MongoClient.db.collection("profile");
    const userId = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toHexString();
    const existingUserInProfile = await profile.findOne({ user_id: userId });
    const file = req.file;
    if (!file) {
        return res.status(400).send("Nenhuma imagem foi enviada.");
    }
    if (!existingUserInProfile) {
        await profile.insertOne({ user_id: userId, image: file.buffer });
    }
    else {
        await profile.updateOne({ user_id: userId }, { $set: { image: file.buffer } });
    }
    res.status(200).json({ message: "Dados salvos!" });
});
exports.saveImageProfileRoute = saveImageProfileRoute;
