import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const getMatches = Router();

export const getMatchesFavoriteRoute = () =>
  getMatches.get("/matches-favorite", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const matches = await MongoClient.db.collection("matches");
    const favoriteMatches = await MongoClient.db.collection("favoriteMatch");
    const refusedMatches = await MongoClient.db.collection("refusedMatch");
    const acceptedMatches = await MongoClient.db.collection("acceptedMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const existingMatchesRefused = await refusedMatches.find({user_id: userId}).toArray();
    const existingMatchesAccepted = await acceptedMatches.find({ "players.userId": userId }).toArray();

    const existingMatchesRefusedIds = existingMatchesRefused.map((id) => new ObjectId(id.match_id));
    const existingMatchesAcceptedIds = existingMatchesAccepted.map((id) => new ObjectId(id.match_id));
    const existingMatchesFavorite = await favoriteMatches
      .find({ 
        _id: { $nin: [...existingMatchesRefusedIds, ...existingMatchesAcceptedIds] },
        user_id: userId 
      })
      .sort({ date: 1 })
      .toArray();

    const listMatches = await Promise.all(
    existingMatchesFavorite.map(async (objeto) => {
        const objectId = new ObjectId(objeto.match_id);
        const match = await matches.findOne({ _id: objectId });
        const newMatch = {
            id: objeto.match_id,
            sport: match?.sport,
            category: match?.category,
            position: match?.position,
            vacancies: match?.vacancies,
            description: match?.description,
            city: match?.city,
            state: match?.state,
            club: match?.club,
            block: match?.block,
            date: match?.date,
            startHour: match?.startHour,
            endHour: match?.endHour,
            profile_phoneNumber: match?.profile_phoneNumber,
        };
        return newMatch;
    }));
    res.status(200).json(listMatches);
  });