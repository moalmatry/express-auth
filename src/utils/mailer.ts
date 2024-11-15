import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import log from './logger';

// Create test emails
// const createTestCreds = async () => {
//   const creds = await nodemailer.createTestAccount();

//   console.log({ creds });
// };

// createTestCreds();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      return log.error(error, 'Error sending email');
    }

    log.info(`Email sent: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
