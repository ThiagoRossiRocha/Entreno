import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const deleteMatches = Router();

export const deleteMatchesRoute = () =>
  deleteMatches.delete("/matches/:id", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const id = req.params.id;    
    const users = await MongoClient.db.collection("users");
    const matches = await MongoClient.db.collection("matches");
    const acceptedMatches = await MongoClient.db.collection("acceptedMatch");
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();

    if(!existingUser) {
      res.status(400).json({ error: 'Usuário não encontrado.' });
      return;
    }

    const existingMatch = await matches.findOne({ _id: new ObjectId(id) });
    const existingMatchInAcceptedMatch = await acceptedMatches.findOne({match_id: id})

    if (!existingMatch) {
        res.status(400).json({ message: "Partida não encontrada." });
        return;
    }

    if(existingMatchInAcceptedMatch) {
        await acceptedMatches.deleteOne({match_id: id});
    }

    await matches.deleteOne({_id: new ObjectId(id), user_id: userId});

    res.status(200).json({ message: "Dados deletados!" });
  });