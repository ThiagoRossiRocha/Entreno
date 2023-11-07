import dotenv from 'dotenv';

dotenv.config({
  path: '.env.production'
});

const port: any = process.env.PORT || 3030;
const ip: any = process.env.IP || "0.0.0.0";

const chaveSecreta: any = process.env.CHAVE_SECRETA;

const mongoDbUserName: any = process.env.MONGODB_USERNAME;

const mongoDbUserUrl: any = process.env.MONGODB_URL_ATLAS;

const gmailPassword: any = process.env.GMAIL_PASSWORD;

const gmail: any = process.env.GMAIL;

console.log({
  port,
  ip,
  chaveSecreta,
  mongoDbUserName,
  mongoDbUserUrl,
  gmailPassword,
  gmail
});

export {
  port,
  ip,
  chaveSecreta,
  mongoDbUserName,
  mongoDbUserUrl,
  gmailPassword,
  gmail
}