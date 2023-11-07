import { logoEntreno64 } from "../../images/logo-entreno";
import { gmail } from "../../util/getDotEnv";
import transporter from "./transporter";

async function sendRecoveryEmail(email: string, token: string) {
  const mailOptions = {
    from: gmail,
  to: email,
  subject: "Recuperação de Senha",
  html: `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Recuperação de Senha</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }
        
        h1 {
          font-size: 24px;
          font-weight: bold;
        }
        
        p {
          margin-bottom: 10px;
        }
        
        .barra-cabecalho {
          background-color: #007BFF;
          color: #fff;
          padding: 10px;
        }
        
        .barra-rodape {
          background-color: #007BFF;
          color: #fff;
          padding: 10px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <header class="barra-cabecalho">
        <h1>Recuperação de Senha</h1>
      </header>
      <main>
        <p>Olá,</p>
        <p>Recebemos uma solicitação de recuperação de senha para a sua conta. Para redefinir sua senha, siga as instruções abaixo:</p>
        <ol>
          <li>Clique no link a seguir para redefinir sua senha:</li>
          <li><a href="http://entreno.net.br/reset-password?token=${token}">Redefinir Senha</a></li>
        </ol>
        <p>Se você não solicitou a recuperação de senha, ignore este e-mail.</p>
      </main>
      <footer class="barra-rodape">
        <img src="data:image/png;base64,${logoEntreno64}" alt="Logo da Entreno" width="200" style="display: block; margin-top: 20px;">
      </footer>
    </body>
    </html>
  `,
    // html: `
    //   <p>Você solicitou uma recuperação de senha.</p>
    //   <p>Clique <a href="http://entreno.net.br/reset-password?token=${token}">aqui</a> para redefinir sua senha.</p>
    //   <p><img src="data:image/png;base64,${logoEntreno64}" alt="Logotipo Entreno" /></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail de recuperação enviado:", info.response);
    
  } catch (error) {
    console.error("Erro ao enviar o e-mail de recuperação:", error);
  }
}

export default sendRecoveryEmail;
