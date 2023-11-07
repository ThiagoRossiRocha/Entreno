"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const getDotEnv_1 = require("../../util/getDotEnv");
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: getDotEnv_1.gmail,
        pass: getDotEnv_1.gmailPassword, // Sua senha de e-mail
    },
});
exports.default = transporter;
