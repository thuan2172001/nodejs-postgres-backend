import express from "express";
import { CheckAuth, skipGuestQuery } from "../../middlewares/auth.mid";
import CommonError from "../../library/error";
import { success } from "../../../utils/response-utils";
import { editInfo, getSalesData, getAll, getCreatorInfo, createCreator } from "./creator.service";
import { Creators } from "../../../models/creator";

const api = express.Router();

api.get("/creator", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { page, limit, pattern } = req.query;
    const results = await getAll({ page, limit, pattern })

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/creator/sales", CheckAuth, async (req, res) => {
  try {
    const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const data = await getSalesData({ creatorId });

    return res.json(success(data));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/creator/profile", async (req, res) => {
  try {
    const creator = await Creators.findAll();

    if (creator?.length > 0) {
      return res.json(success(creator[0]));
    }

    throw new Error("AUTH.ERROR.USER_NOT_FOUND");
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/creator/:creatorId", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { creatorId } = req.params;
    const results = await getCreatorInfo({ creatorId })

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/creator/profile", CheckAuth, async (req, res) => {
  try {
    const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { shopName, avatar, description, sns, mediaLinks } = req.body;
    const result = await editInfo({
      creatorId,
      shopName,
      avatar,
      description,
      sns,
      mediaLinks,
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});


api.post("/creator", async (req, res) => {
  try {
    const {
      username,
      email,
      fullName,
      publicKey,
      encryptedPrivateKey,
      phoneNumber,
      avatar,
      description
    } = req.body;

    const result = await createCreator({
      username,
      email,
      fullName,
      publicKey,
      encryptedPrivateKey,
      phoneNumber,
      avatar,
      description
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
