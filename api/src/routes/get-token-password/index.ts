import { Router } from "express";
import { MongoClient } from "../../database/mongo";

const user = Router();

export const getTokenPasswordRoute = () =>
  user.get("/token-password", async (req, res) => {
    const tokenPassword = req.headers.authorization;
    if (!tokenPassword) {
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ tokenPassword: tokenPassword });
    
    if (!existingUser) {
      res.status(401).json({ message: "token inválido" });
      return;
    }    

    res.status(200).json({ message: "token válido" });
  });
