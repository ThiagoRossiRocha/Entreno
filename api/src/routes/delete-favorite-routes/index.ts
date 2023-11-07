import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const deleteMatches = Router();

export const deleteMatchesFavoriteRoute = () =>
  deleteMatches.delete("/matches-favorite/:id", async (req, res) => {
    const tokenUser = req.headers.authorization;
    const id = req.params.id;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const favoriteMatch = await MongoClient.db.collection("favoriteMatch");
    await favoriteMatch.deleteOne({match_id: id, user_id: userId});
    
    res.status(200).json({message: "Dados deletados!"});
  });