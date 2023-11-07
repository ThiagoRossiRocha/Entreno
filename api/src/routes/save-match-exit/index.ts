import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const saveMatches = Router();

export const saveMatchExitRoute = () =>
  saveMatches.post("/matches-exit", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const { matchId } = req.body;

    const users = await MongoClient.db.collection("users");
    const acceptedMatches = await MongoClient.db.collection("acceptedMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();

    const filter = { "players.userId": userId, match_id: matchId };
    const update = { $pull: { players: { userId: userId } } };

    const result = await acceptedMatches.updateOne(filter, update);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Dados removidos!" });
    } else {
      res.status(400).json({ message: "Jogador não encontrado na lista de jogadores." });
    }
  });
