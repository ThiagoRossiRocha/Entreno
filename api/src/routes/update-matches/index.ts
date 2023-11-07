import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const saveMatches = Router();

export const updateMatchesRoute = () =>
  saveMatches.post("/matches-update", async (req, res) => {
    const { id, sport, category, position, vacancies, club, description, city, state, block, date, startHour, endHour } = req.body;
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const users = await MongoClient.db.collection("users");    
    const matches = await MongoClient.db.collection("matches");

    const existingUser = await users.findOne({ token: tokenUser });
    if (!existingUser) {
      res.status(400).json({ message: 'Usuário não encontrado.' });
      return;
    } 

    const existingMatch = await matches.findOne({ _id: new ObjectId(id) });
    if (!existingMatch) {
      res.status(400).json({ message: "Partida não encontrada." });
      return;
    }

    if (existingUser?._id.toHexString() !== existingMatch.user_id) {
      res.status(400).json({ message: "Usuário não autorizado." });
      return;
    }

    const query = { _id: new ObjectId(id) };

    const update = {
        $set: {
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
        }
    };

    const result = await matches.updateOne(query, update);

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Dados salvos!" });
    } else {
      res.status(400).json({ message: "Falha ao atualizar a partida, nenhum dado foi alterado." });
    }
  });