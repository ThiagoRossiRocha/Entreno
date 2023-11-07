import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const getMatches = Router();

export const getMatchesRoute = () =>
  getMatches.get("/matches", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const matches = await MongoClient.db.collection("matches");
    const acceptedMatch = await MongoClient.db.collection("acceptedMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const existingMatches = await matches
      .find({ user_id: existingUser?._id.toHexString() })
      .sort({ date: 1 })
      .toArray();

    const listMatches = await Promise.all(existingMatches.map(async (objeto) => {
      const acceptedMatches = await acceptedMatch.findOne({ match_id: objeto?._id.toHexString() });
      function calculateEditMatches(acceptedMatches: any) {
        const numberOfPlayers = acceptedMatches?.players.length;
        if(numberOfPlayers === 1 || !numberOfPlayers) return  true;
        else return false;
      }
      const newMatch = {
        id: objeto?._id.toHexString(),
        sport: objeto?.sport,
        category: objeto?.category,
        position: objeto?.position,
        vacancies: objeto?.vacancies,
        description: objeto?.description,
        city: objeto?.city,
        state: objeto?.state,
        club: objeto?.club,
        block: objeto?.block,
        date: objeto?.date,
        startHour: objeto?.startHour,
        endHour: objeto?.endHour,
        profile_phoneNumber: objeto?.profile_phoneNumber,
        editMatches: calculateEditMatches(acceptedMatches),
      };
      return newMatch;
    }));
    res.status(200).json(listMatches);
  });