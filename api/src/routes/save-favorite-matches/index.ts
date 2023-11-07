import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const saveMatches = Router();

export const saveMatchesFavoriteRoute = () =>
  saveMatches.post("/matches-favorite", async (req, res) => {
    const { matchId } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const favoriteMatch = await MongoClient.db.collection("favoriteMatch");
    const existingMatchAndUserInFavoriteMatch = await favoriteMatch.findOne({ user_id: userId, match_id: matchId })
    
    const newFavoriteMatch = {
      user_id: userId,
      match_id: matchId
    };

    if(!existingMatchAndUserInFavoriteMatch) {
      await favoriteMatch.insertOne(newFavoriteMatch);
      res.status(200).json({message: "Dados salvos!"});
    }
    else{
      res.status(400).json({message: "Match já fixado!"});
    }
  });