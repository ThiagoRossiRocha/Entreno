import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const saveMatches = Router();

export const saveMatchesAcceptedRoute = () =>
  saveMatches.post("/matches-accepted", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const { matchId } = req.body;
    const matches = await MongoClient.db.collection("matches");
    const users = await MongoClient.db.collection("users");
    const acceptedMatch = await MongoClient.db.collection("acceptedMatch");
    const profile = await MongoClient.db.collection("profile");
    const favoriteMatch = await MongoClient.db.collection("favoriteMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    const ownerMatchId = await matches.findOne({ _id: new ObjectId(matchId) });
    const ownerMatchProfile = await profile.findOne({
      user_id: ownerMatchId?.user_id,
    });

    const existingMatchAndUserInAcceptedMatch = await acceptedMatch.findOne({
      match_id: matchId,
      user_id_owner: ownerMatchProfile?.user_id,
    });

    const vacancies = Number(ownerMatchId?.vacancies);
    const remainingVacancies = Number(ownerMatchId?.remainingVacancies);

    const existingAcceptedMatchesInFixedMatches = await favoriteMatch.findOne({
      match_id: matchId,
    });

    if(existingAcceptedMatchesInFixedMatches) {
      await favoriteMatch.deleteOne({match_id: matchId, user_id: userId});
    }

    if (vacancies === 1 || vacancies === 2 || vacancies === 3) {
      
      if (!existingMatchAndUserInAcceptedMatch) {
        const newAcceptedMatch: any = {
          match_id: matchId,
          user_id_owner: ownerMatchProfile?.user_id,
          players: [{ userId: ownerMatchProfile?.user_id }, { userId }],
          remainingVacancies: vacancies - 1
        };
        
        await acceptedMatch.insertOne(newAcceptedMatch);
        return res.status(200).json({ message: "Dados salvos!" });
      } else {
        if (existingMatchAndUserInAcceptedMatch.players.length <= vacancies) {
          const newPlayer = { userId };
          await acceptedMatch.updateOne(
            { match_id: matchId, user_id_owner: ownerMatchProfile?.user_id },
            { $push: { players: newPlayer } }
          );
          
          const updatedRemainingVacancies = vacancies - existingMatchAndUserInAcceptedMatch.players.length;
          await acceptedMatch.updateOne(
            { match_id: matchId, user_id_owner: ownerMatchProfile?.user_id },
            { $set: { remainingVacancies: updatedRemainingVacancies } }
          );
          return res.status(200).json({ message: "Dados salvos!" });
        } else {
          return res.status(400).json({ message: "Vagas Insuficientes!" });
        }
      }
    }
  });
