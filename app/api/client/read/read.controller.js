import express from "express";
import { CheckAuth, skipGuestQuery } from "../../middlewares/auth.mid";
import CommonError from "../../library/error";
import { success } from "../../../utils/response-utils";
import {
  getSignedUrl,
  getSerie,
  updateSettingRead,
  getSettingRead,
} from "./read.service";

const api = express.Router();

api.get(
  "/read/:serieId/:episodeId",
  skipGuestQuery(CheckAuth),
  async (req, res) => {
    try {
      const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
      const { fromPage, endPage, serieId } = req.query;
      const { episodeId } = req.params;
      const data = await getSignedUrl({
        userId,
        episodeId,
        fromPage,
        endPage,
      });
      return res.json(success(data));
    } catch (err) {
      console.log(err.message);
      return CommonError(req, err, res);
    }
  }
);

api.get("/read/:serieId", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { serieId } = req.params;
    const serie = await getSerie({
      serieId,
      userId,
    });
    return res.json(success(serie));
  } catch (err) {
    console.log(err.message);
    return CommonError(req, err, res);
  }
});

api.post("/setting-read", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { settingRead } = req.body;

    const setting = await updateSettingRead({
      userId,
      settingRead,
    });

    return res.json(success(setting));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/setting-read", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    const setting = await getSettingRead({
      userId,
    });

    return res.json(success(setting));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
