import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const saveMatches = Router();

export const saveMatchesRefusedRoute = () =>
  saveMatches.post("/matches-refused", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const { matchId } = req.body;
    
    const users = await MongoClient.db.collection("users");
    const refusedMatch = await MongoClient.db.collection("refusedMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const existingMatchAndUserInRefusedMatch = await refusedMatch.findOne({ user_id: userId, match_id: matchId });

    const newRefusedMatch = {
      user_id: userId,
      match_id: matchId,
    };

    if(!existingMatchAndUserInRefusedMatch) {
     await refusedMatch.insertOne(newRefusedMatch);
      res.status(200).json({message: "Dados salvos!"});
    }
    else{
      res.status(400).json({message: "Partida já recusada!"});
    }
  });