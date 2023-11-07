"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logo_entreno_1 = require("../../images/logo-entreno");
const getDotEnv_1 = require("../../util/getDotEnv");
const transporter_1 = __importDefault(require("./transporter"));
async function sendRecoveryEmail(email, token) {
    const mailOptions = {
        from: getDotEnv_1.gmail,
        to: email,
        subject: "Recuperação de Senha",
        html: `
      <p>Você solicitou uma recuperação de senha.</p>
      <p>Clique <a href="https://entreno.net.br/reset-password?token=${token}">aqui</a> para redefinir sua senha.</p>
      <p><img src="data:image/png;base64,${logo_entreno_1.logoEntreno64}" alt="Logotipo Entreno" /></p>`,
    };
    try {
        const info = await transporter_1.default.sendMail(mailOptions);
        console.log("E-mail de recuperação enviado:", info.response);
    }
    catch (error) {
        console.error("Erro ao enviar o e-mail de recuperação:", error);
    }
}
exports.default = sendRecoveryEmail;
