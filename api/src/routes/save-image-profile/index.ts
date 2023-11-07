import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import multer from "multer";

const saveImage = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const saveImageProfileRoute = () =>
  saveImage.post("/image-profile", upload.single("croppedImage"), async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const profile = await MongoClient.db.collection("profile");
    const userId = existingUser?._id.toHexString()
    const existingUserInProfile = await profile.findOne({ user_id: userId });

    const file = req.file;
    if (!file) {
      return res.status(400).send("Nenhuma imagem foi enviada.");
    }

    if(!existingUserInProfile){
        await profile.insertOne({ user_id: userId, image: file.buffer });
    }
    else{
        await profile.updateOne({ user_id: userId },{$set: {image: file.buffer}});
    }
    res.status(200).json({message: "Dados salvos!"});
  });
