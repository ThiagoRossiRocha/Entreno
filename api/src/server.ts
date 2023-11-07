import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { loginUserRoute } from "./routes/login-user";
import { registerUserRoute } from "./routes/register-user";
import { getMatchesRoute } from "./routes/get-matches";
import { saveProfileRoute } from "./routes/save-profile";
import { getProfileRoute } from "./routes/get-profile";
import { saveMatchesRoute } from "./routes/save-matches";
import { getMatchesDefaultRoute } from "./routes/get-matches-default";
import { getMatchesFunnelRoute } from "./routes/get-matches-funnel";
import { saveMatchesFavoriteRoute } from "./routes/save-favorite-matches";
import { getMatchesFavoriteRoute } from "./routes/get-favorite-matches";
import { deleteMatchesFavoriteRoute } from "./routes/delete-favorite-routes";
import { getMatchesAcceptedRoute } from "./routes/get-matches-accepted";
import { saveMatchesAcceptedRoute } from "./routes/save-matches-accepted";
import { saveImageProfileRoute } from "./routes/save-image-profile";
import { getImageProfileRoute } from "./routes/get-image-profile";
import { saveMatchesRefusedRoute } from "./routes/save-matches-refused";
import { saveMatchExitRoute } from "./routes/save-match-exit";
import { updateMatchesRoute } from "./routes/update-matches";
import { deleteMatchesRoute } from "./routes/delete-matches";
import { sendForgotEmailRoute } from "./routes/forgot-email-user";
import { getTokenPasswordRoute } from "./routes/get-token-password";
import { saveNewPasswordRoute } from "./routes/save-reset-password";
import { ip, port } from "./util/getDotEnv";
import { MongoClient } from "./database/mongo";

async function main(): Promise<void> {
  config();
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  await MongoClient.connect();

  app.post("/login", loginUserRoute());
  app.post("/register", registerUserRoute());
  app.get("/token-password", getTokenPasswordRoute());
  app.post("/reset-password", saveNewPasswordRoute());
  app.post("/forgot-email", sendForgotEmailRoute());
  app.post("/matches", saveMatchesRoute());
  app.post("/matches-update", updateMatchesRoute());
  app.get("/matches", getMatchesRoute());
  app.delete("/matches/:id", deleteMatchesRoute());
  app.post("/matches-refused", saveMatchesRefusedRoute());
  app.post("/matches-exit", saveMatchExitRoute());
  app.get("/matches-default", getMatchesDefaultRoute());
  app.get("/matches-funnel", getMatchesFunnelRoute());
  app.post("/matches-favorite", saveMatchesFavoriteRoute());
  app.get("/matches-favorite", getMatchesFavoriteRoute());
  app.delete("/matches-favorite/:id", deleteMatchesFavoriteRoute());
  app.post("/matches-accepted", saveMatchesAcceptedRoute());
  app.get("/matches-accepted", getMatchesAcceptedRoute());
  app.post("/image-profile", saveImageProfileRoute());
  app.get("/image-profile", getImageProfileRoute());  
  app.post("/profile", saveProfileRoute());
  app.get("/profile", getProfileRoute());

  app.listen(port, ip, () => console.log(`🔥 Start server at http://${ip}:${port} 🔥`));
}

main();
