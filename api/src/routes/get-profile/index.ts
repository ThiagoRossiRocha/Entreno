import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const getProfile = Router();

export const getProfileRoute = () =>
  getProfile.get("/profile", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const profile = await MongoClient.db.collection("profile");

    const existingUser = await users.findOne({ token: tokenUser });
    const existingProfile = await profile.findOne({ user_id: existingUser?._id.toHexString() });
    
    const newProfile = {
      sport: existingProfile?.sport,
      category: existingProfile?.category,
      position: existingProfile?.position,
      fullName: existingProfile?.fullName,
      email: existingUser?.email,
      cpf: existingProfile?.cpf,
      city: existingProfile?.city,
      state: existingProfile?.state,
      phoneNumber: existingProfile?.phoneNumber,
    }
    
    res.status(200).json(newProfile);
  });