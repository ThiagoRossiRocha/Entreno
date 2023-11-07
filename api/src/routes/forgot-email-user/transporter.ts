import nodemailer from 'nodemailer';
import { gmail, gmailPassword } from '../../util/getDotEnv';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: gmail, 
    pass: gmailPassword, 
  },
});

export default transporter;
