import { CheckAuth } from "../../../middlewares/auth.mid";
import { createCode, verifyCode } from "../../common-service/code.service";
import { sendEmail } from "../../common-service/mail.service";

const api = require("express").Router();
const { success, serverError } = require("../../../../utils/response-utils");
const { Users } = require("../../../../models/user");
const { Creators } = require("../../../../models/creator");
const { Codes } = require("../../../../models/code");
const { error } = require("../../../../services/logger");

api.post("/auth/credential", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      throw new Error("AUTH.ERROR.INVALID_REQUEST");
    } else {
      const user = await Users.findOne({ where: { username } });

      if (user) {
        if (user.isBanned) {
          throw new Error("AUTH.BANNED");
        }
        return res.json(success(user));
      }

      const creator = await Creators.findOne({ where: { username } });

      if (creator) {
        if (creator.isBanned) {
          throw new Error("AUTH.BANNED");
        }
        return res.json(success(creator));
      }

      throw new Error("AUTH.ERROR.USER_NOT_FOUND");
    }
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.post("/auth/ping", CheckAuth, async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { username: req.body.certificateInfo.username },
    });

    if (user) {
      return res.json(success(user));
    }

    const creator = await Creators.findOne({
      where: { username: req.body.certificateInfo.username },
    });

    if (creator) {
      return res.json(success(creator));
    }

    throw new Error("AUTH.ERROR.USER_NOT_FOUND");
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.get("/auth/profile", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    const user = await Users.findOne({
      where: { _id: userId },
    });

    if (user) {
      return res.json(success(user));
    }

    const creator = await Creators.findOne({
      where: { _id: userId },
    });

    if (creator) {
      return res.json(success(creator));
    }

    throw new Error("AUTH.ERROR.USER_NOT_FOUND");
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.put("/auth/password", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { publicKey, encryptedPrivateKey } = req.body;

    if (!publicKey || !encryptedPrivateKey)
      throw new Error("AUTH.ERROR.BODY_MISSING_FIELD");

    const user = await Users.findOne({
      where: { _id: userId },
    });

    if (user) {
      const statusCode = await Users.update(
        { publicKey, encryptedPrivateKey },
        { where: { _id: userId } }
      );
      const result = statusCode > 0 ? "success" : "failed";
      return res.json(success(result));
    }

    const creator = await Creators.findOne({
      where: { _id: userId },
    });

    if (creator) {
      const statusCode = await Users.update(
        { publicKey, encryptedPrivateKey },
        { where: { _id: userId } }
      );
      const result = statusCode > 0 ? "success" : "failed";
      return res.json(success(result));
    }

    throw new Error("AUTH.ERROR.USER_NOT_FOUND");
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: { email },
    });

    if (!user) throw new Error("AUTH.ERROR.FORGOT_PASSWORD.MAIL_NOT_EXISTS");

    const activeCode = await createCode({ userId: user._id });

    const status = await sendEmail({
      activeCode,
      email,
      type: "reset-password",
    });

    console.log(status);

    return res.json(success({ status }));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.put("/auth/reset-password", async (req, res) => {
  try {
    const { codeId, userId, publicKey, encryptedPrivateKey } = req.body;

    const verifyStatus = await verifyCode({ codeId, userId });

    if (!verifyStatus) throw new Error("AUTH.ERROR.RESET_PASSWORD.FAILED");

    if (!publicKey || !encryptedPrivateKey)
      throw new Error("AUTH.ERROR.BODY_MISSING_FIELD");

    const user = await Users.findOne({
      where: { _id: userId },
    });

    if (user) {
      const statusCode = await Users.update(
        { publicKey, encryptedPrivateKey },
        { where: { _id: userId } }
      );
      const result = statusCode > 0 ? "success" : "failed";
      return res.json(success(result));
    }

    const creator = await Creators.findOne({
      where: { _id: userId },
    });

    if (creator) {
      const statusCode = await Users.update(
        { publicKey, encryptedPrivateKey },
        { where: { _id: userId } }
      );
      const result = statusCode > 0 ? "success" : "failed";
      return res.json(success(result));
    }

    return res.json(success({ status }));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

module.exports = api;
