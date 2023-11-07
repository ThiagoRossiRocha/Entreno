import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { chaveSecreta } from "../../util/getDotEnv";
import { MongoClient } from "../../database/mongo";
const loginUser = Router();

export const loginUserRoute = () =>
  loginUser.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const users = await MongoClient.db.collection('users')

      const user = await users.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Senha incorreta' });
        return;
      }
      
      const token = jwt.sign({ userId: user._id }, chaveSecreta);
      await users.updateOne({ email },{$set: {token: token}});
      
      res.status(200).json({ token, message: 'Login bem-sucedido' });
    } catch (error) {
      res.status(401).json({ error: error });
    }
  });