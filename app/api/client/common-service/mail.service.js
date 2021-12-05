const {
  FRONTEND_BASE_URL,
  MAIL_NAME,
  MAIL_PASS,
} = require("../../../environment");

const mailer = require("nodemailer");

const { Users } = require("../../../models/user");
const { Creators } = require("../../../models/creator");

import { resetPasswordTemplate } from "./mail.template";

const _generateURL = ({ type, activeCode, userId }) => {
  if (type === "reset-password")
    return `${FRONTEND_BASE_URL}/reset-password?code=${activeCode}&user=${userId}`;
  else if (type === "verify-email")
    return `${FRONTEND_BASE_URL}/verify-email?code=${activeCode}&user=${userId}`;
  return "";
};

const _configEmailTemplate = ({ to, href, type }) => {
  switch (type) {
    case "reset-password":
      return {
        from: "TECHNICAL DEBT <MAIL_NAME>",
        to,
        subject: "[WEBTOONZ] Reset Password",
        html: resetPasswordTemplate(href),
      };

    case "verify-email":
      return {
        from: "TECHNICAL DEBT <MAIL_NAME>",
        to,
        subject: "[WEBTOONZ] Verification Email",
        html: resetPasswordTemplate(href),
      };

    default:
      throw new Error("GMAIL.INVALID_ACTION_TYPE");
  }
};

export const sendEmail = async ({ activeCode, email, type }) => {
  const smtpTransport = mailer.createTransport({
    service: "gmail",
    auth: {
      user: MAIL_NAME,
      pass: MAIL_PASS,
    },
  });

  await smtpTransport.verify((err) => {
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

  const href = _generateURL({ type, activeCode, userId: user._id });

  const mailDataConfig = _configEmailTemplate({ to: user.email, href, type });

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
