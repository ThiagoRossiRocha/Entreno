import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const getMatches = Router();

export const getMatchesFunnelRoute = () =>
  getMatches.get("/matches-funnel", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const sportFilter = req.headers.sportfilter;
    const categoryFilter = req.headers.categoryfilter;
    const cityFilter = req.headers.cityfilter;
    const stateFilter = req.headers.statefilter;

    const users = await MongoClient.db.collection("users");
    const matches = await MongoClient.db.collection("matches");
    const profile = await MongoClient.db.collection("profile");
    const fixedMatches = await MongoClient.db.collection("favoriteMatch");
    const refusedMatches = await MongoClient.db.collection("refusedMatch");
    const acceptedMatches = await MongoClient.db.collection("acceptedMatch");
    
    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const userProfile = await profile.findOne({ user_id: userId });
    const existingMatchesFixed = await fixedMatches.find({user_id: userId}).toArray();
    const existingMatchesRefused = await refusedMatches.find({user_id: userId}).toArray();
    const existingMatchesAccepted = await acceptedMatches.find({ "players.userId": userId }).toArray();
    const existingMatchesNoVacanvies = await acceptedMatches.find({ remainingVacancies: 0 }).toArray();

    const existingMatchesFixedIds = existingMatchesFixed.map((id) => new ObjectId(id.match_id));
    const existingMatchesRefusedIds = existingMatchesRefused.map((id) => new ObjectId(id.match_id));
    const existingMatchesAcceptedIds = existingMatchesAccepted.map((id) => new ObjectId(id.match_id));
    const existingMatchesNoVacanviesIds = existingMatchesNoVacanvies.map((id) => new ObjectId(id.match_id));

    const existingMatches = await matches
      .find({
        _id: { $nin: [...existingMatchesFixedIds, ...existingMatchesRefusedIds, ...existingMatchesAcceptedIds, ...existingMatchesNoVacanviesIds] },
        user_id: { $ne: userId }, 
        sport: sportFilter || userProfile?.sport, 
        category: categoryFilter || userProfile?.category,
        state: stateFilter || userProfile?.state,
        city: cityFilter || userProfile?.city
    
      })
      .sort({ date: 1 })
      .toArray();

    const listMatches = existingMatches.map((objeto) => {
      const newMatch = {
        id: objeto?._id,
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
      };
      return newMatch;
    });

    res.status(200).json(listMatches);
  });