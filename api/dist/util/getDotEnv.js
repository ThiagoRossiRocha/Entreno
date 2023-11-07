"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmail = exports.gmailPassword = exports.mongoDbUserUrl = exports.mongoDbUserName = exports.chaveSecreta = exports.ip = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: '.env.production'
});
const port = process.env.PORT || 3030;
exports.port = port;
const ip = process.env.IP || "0.0.0.0";
exports.ip = ip;
const chaveSecreta = process.env.CHAVE_SECRETA;
exports.chaveSecreta = chaveSecreta;
const mongoDbUserName = process.env.MONGODB_USERNAME;
exports.mongoDbUserName = mongoDbUserName;
const mongoDbUserUrl = process.env.MONGODB_URL_ATLAS;
exports.mongoDbUserUrl = mongoDbUserUrl;
const gmailPassword = process.env.GMAIL_PASSWORD;
exports.gmailPassword = gmailPassword;
const gmail = process.env.GMAIL;
exports.gmail = gmail;
console.log({
    port,
    ip,
    chaveSecreta,
    mongoDbUserName,
    mongoDbUserUrl,
    gmailPassword,
    gmail
});
