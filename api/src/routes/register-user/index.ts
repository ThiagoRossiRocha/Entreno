import { Router } from "express";
import { MongoClient } from "../../database/mongo";
import bcrypt from "bcrypt";
import { User } from "../../models/User";

const createUser = Router();

export const registerUserRoute = () =>
  createUser.post("/register", async (req, res) => {
    const { userName, email, password, createdAt } = req.body;

    const users = await MongoClient.db.collection("users");
    const existingUser = await users.findOne({ email } || { userName });
    if (existingUser) {
      res.status(400).json({ message: "Usuário já registrado" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      userName,
      email,
      password: hashedPassword,
      createdAt,
    };

    const result = await users.insertOne(newUser);
    newUser._id = result.insertedId.toHexString();
    res.status(200).json({message: "usuário registrado com sucesso!"});
  });
