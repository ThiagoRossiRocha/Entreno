import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import bcrypt from "bcrypt";

const saveUser = Router();

export const saveNewPasswordRoute = () =>
  saveUser.post("/reset-password", async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization;

    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ tokenPassword: token });

    if (!existingUser) {
      res.status(400).json({ message: "Usuário não registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.updateOne({ tokenPassword: token },{$set: {password: hashedPassword, tokenPassword: ""}});
    res.status(200).json({message: "Senha alterada com sucesso!"});
  });