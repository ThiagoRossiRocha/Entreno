import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import jwt from 'jsonwebtoken';
import sendRecoveryEmail from "./sendRecoveryEmail";
import { chaveSecreta } from "../../util/getDotEnv";

const user = Router();

export const sendForgotEmailRoute = () =>
  user.post("/forgot-email", async (req, res) => {
    const { email } = req.body;

    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      res.status(400).json({ message: "Usuário não registrado" });
      return;
    }

    const expiresIn = '1h';
    const token = jwt.sign({ userId: existingUser._id }, chaveSecreta, { expiresIn });
    sendRecoveryEmail(email, token);
    await users.updateOne({ email },{$set: {tokenPassword: token}});

    res.status(200).json({message: "Recuperação de email enviada com sucesso!"});
  });
