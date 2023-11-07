import { MongoClient as Mongodb, Db } from "mongodb";
import { mongoDbUserUrl } from "../util/getDotEnv";

export const MongoClient = {
  client: undefined as unknown as Mongodb,
  db: undefined as unknown as Db,

  async connect(): Promise<void> {

    if (!mongoDbUserUrl) return console.log("Error starting the server mongodb");

    const client = new Mongodb(mongoDbUserUrl);
    const db = client.db("entrenoDb");

    this.client = client;
    this.db = db;

    console.log(
      `🔥 Connected to mongodb in ${mongoDbUserUrl} 🔥`,
    );
  },
};

