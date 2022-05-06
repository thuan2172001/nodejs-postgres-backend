import express from "express";
import { CheckAuth, skipGuestQuery } from "../../middlewares/auth.mid";
import CommonError from "../../library/error";
import { success } from "../../../utils/response-utils";
import {
  getById,
  createSerie,
  editSerie,
  editSerieStatus,
  getAllByUser,
  getAllByCreator,
  getByIdAndStatus,
} from "./serie.service";

const api = express.Router();

api.get("/serie", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { page, limit, categoryId, isCreator, isPublished, pattern, creatorId } =
      req.query;
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results =
      isCreator && isCreator != "false"
        ? await getAllByCreator({ userId, page, limit, isPublished })
        : await getAllByUser({ userId, page, limit, categoryId, pattern, creatorId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/serie/:serieId/episodes", CheckAuth, async (req, res) => {
  try {
    const { serieId } = req.params;
    const { isPublished, page, limit } = req.query;
    const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results = await getByIdAndStatus({
      creatorId,
      serieId,
      isPublished: isPublished == "true",
      page,
      limit,
    });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/serie/:serieId", skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { serieId } = req.params;
    const { page, limit, pattern } = req.query;
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results = await getById({ userId, serieId, page, limit, pattern });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post("/serie", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { cover, thumbnail, serieName, categoryId, description } = req.body;
    const results = await createSerie({
      cover,
      thumbnail,
      serieName,
      categoryId,
      description,
      userId,
    });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post("/serie/status", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { type, serieId } = req.body;
    const statusCode = await editSerieStatus({ serieId, type, userId });
    const result = statusCode > 0 ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/serie/:serieId", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { serieId } = req.params;
    const { cover, thumbnail, serieName, categoryId, description } = req.body;
    const result = await editSerie({
      serieId,
      cover,
      thumbnail,
      serieName,
      categoryId,
      description,
      userId,
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
