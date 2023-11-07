import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const saveMatches = Router();

export const saveMatchesRoute = () =>
  saveMatches.post("/matches", async (req, res) => {
    const { sport, category, position, vacancies, club, description, city, state, block, date, startHour, endHour } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const profile = await MongoClient.db.collection("profile");
    const userId = existingUser?._id.toHexString();
    const existingProfile = await profile.findOne({ user_id: userId });
    const matches = await MongoClient.db.collection("matches");

    const newMatch = {
        user_id: userId,
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
        profile_phoneNumber: existingProfile?.phoneNumber,
    };
    
    await matches.insertOne(newMatch);
    res.status(200).json({message: "Dados salvos!"});
  });