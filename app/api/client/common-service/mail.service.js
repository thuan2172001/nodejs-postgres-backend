const {
  FRONTEND_BASE_URL,
  MAIL_NAME,
  MAIL_PASS,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
} = require("../../../environment");

const mailer = require("nodemailer");
const { google } = require("googleapis");
const { Users } = require("../../../models/user");
const { Creators } = require("../../../models/creator");
const OAuth2 = google.auth.OAuth2;
import { resetPasswordTemplate } from "./mail.template";

const _generateURL = ({ type, activeCode, userId }) => {
  if (type === "reset-password")
    return `${FRONTEND_BASE_URL}/reset-password?code=${activeCode}&user=${userId}`;
  else if (type === "verify-email")
    return `${FRONTEND_BASE_URL}/verify-email?code=${activeCode}&user=${userId}`;
  return "";
};

const _configEmailTemplate = ({ to, activeCode, type }) => {
  switch (type) {
    case "reset-password":
      return {
        from: "TECHNICAL DEBT <MAIL_NAME>",
        to,
        subject: "[WEBTOONZ] Reset Password",
        html: resetPasswordTemplate(activeCode),
      };

    case "verify-email":
      return {
        from: "TECHNICAL DEBT <MAIL_NAME>",
        to,
        subject: "[WEBTOONZ] Verification Email",
        html: resetPasswordTemplate(activeCode),
      };

    default:
      throw new Error("GMAIL.INVALID_ACTION_TYPE");
  }
};

export const sendEmail = async ({ activeCode, email, type }) => {

  let client_id = CLIENT_ID
  let client_secret = CLIENT_SECRET
  let refresh_token = REFRESH_TOKEN
  let access_token = ACCESS_TOKEN

  const oauth2Client = new OAuth2(
    client_id,
    client_secret,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: refresh_token
  });

  const smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "thuan2172001@gmail.com",
      accessToken: access_token,
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken: refresh_token
    }
  });

  smtpTransport.verify((err) => {
    if (err) {
      // throw new Error("GMAIL.SERVICE_FAILED");
      console.log({ err });
    }
  });

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  const creator = await Creators.findOne({
    where: {
      email,
    },
  });

  // if (!user && !creator) {
  // throw new Error("GMAIL.ACCOUNT_NOT_FOUND");
  // }

  // const href = _generateURL({ type, activeCode, userId: user._id });

  const mailDataConfig = _configEmailTemplate({ to: user.email, activeCode, type });

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailDataConfig, (error, response) => {
      if (error) {
        console.log({ error });
        // reject("GMAIL.SERVICE_FAILED");
      } else {
        smtpTransport.close();
        resolve(response);
      }
    });
  });
};
