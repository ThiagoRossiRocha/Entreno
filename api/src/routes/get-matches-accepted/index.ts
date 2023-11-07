import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import { ObjectId } from "mongodb";

const getMatches = Router();

export const getMatchesAcceptedRoute = () =>
  getMatches.get("/matches-accepted", async (req, res) => {
    const tokenUser = req.headers.authorization;
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const users = await MongoClient.db.collection("users");
    const matches = await MongoClient.db.collection("matches");
    const profile = await MongoClient.db.collection("profile");
    const acceptedMatches = await MongoClient.db.collection("acceptedMatch");

    const existingUser = await users.findOne({ token: tokenUser });
    const userId = existingUser?._id.toHexString();
    
    const existingAcceptedMatch = await acceptedMatches.find({ "players.userId": userId }).toArray();

    const listMatches = await Promise.all(
      existingAcceptedMatch.map(async (objeto) => {
        const playerIds = objeto.players.map((player: any) => player.userId);
        
        const playerPromises = playerIds.map((playerId: any) =>
          profile.findOne({ user_id: playerId })
        );
        
        const players = await Promise.all(playerPromises);
        const existingMatch = await matches.findOne({
          _id: new ObjectId(objeto.match_id),
        });

        const newMatch = {
          match_id: objeto?.match_id,
          sport: existingMatch?.sport,
          category: existingMatch?.category,
          vacancies: existingMatch?.vacancies,
          description: existingMatch?.description,
          city: existingMatch?.city,
          state: existingMatch?.state,
          club: existingMatch?.club,
          block: existingMatch?.block,
          date: existingMatch?.date,
          startHour: existingMatch?.startHour,
          endHour: existingMatch?.endHour,
          user_id_owner: objeto?.user_id_owner,
          player1: players[0] ? {
            image: players[0].image,
            category: players[0].category,
            city: players[0].city,
            cpf: players[0].cpf,
            fullName: players[0].fullName,
            phoneNumber: players[0].phoneNumber,
            position: players[0].position,
            sport: players[0].sport,
            state: players[0].state,
            user_id: players[0].user_id,
          } : null,
          player2: players[1] ? {
            image: players[1].image,
            category: players[1].category,
            city: players[1].city,
            cpf: players[1].cpf,
            fullName: players[1].fullName,
            phoneNumber: players[1].phoneNumber,
            position: players[1].position,
            sport: players[1].sport,
            state: players[1].state,
            user_id: players[1].user_id,
          } : null,
          player3: players[2] ? {
            image: players[2].image,
            category: players[2].category,
            city: players[2].city,
            cpf: players[2].cpf,
            fullName: players[2].fullName,
            phoneNumber: players[2].phoneNumber,
            position: players[2].position,
            sport: players[2].sport,
            state: players[2].state,
            user_id: players[2].user_id,
          } : null,
          player4: players[3] ? {
            image: players[3].image,
            category: players[3].category,
            city: players[3].city,
            cpf: players[3].cpf,
            fullName: players[3].fullName,
            phoneNumber: players[3].phoneNumber,
            position: players[3].position,
            sport: players[3].sport,
            state: players[3].state,
            user_id: players[3].user_id,
          } : null,
          userIdToken: userId
        };
        return newMatch;
      })
    );
    res.status(200).json(listMatches);
  });
