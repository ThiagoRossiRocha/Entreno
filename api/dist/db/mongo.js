"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoClient = void 0;
const mongodb_1 = require("mongodb");
const getDotEnv_1 = require("../util/getDotEnv");
exports.MongoClient = {
    client: undefined,
    db: undefined,
    async connect() {
        if (!getDotEnv_1.mongoDbUserUrl)
            return console.log("Error starting the server mongodb");
        const client = new mongodb_1.MongoClient(getDotEnv_1.mongoDbUserUrl);
        const db = client.db("entrenoDb");
        this.client = client;
        this.db = db;
        console.log(`🔥 Connected to mongodb in ${getDotEnv_1.mongoDbUserUrl} 🔥`);
    },
};
