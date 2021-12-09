import express from "express";
import { CheckAuth, skipGuestQuery } from "../../middlewares/auth.mid";
import CommonError from "../../library/error";
import { success } from "../../../utils/response-utils";
import {
  getCart,
  updateCart,
  getCartData,
  editUser,
  createUser,
  editUserStatus,
  getBookshelfData,
  getBookshelf,
  updateBookshelf,
  getFavoriteEpisodes,
  getAllUser,
  findUsersByPattern,
  getAllTransaction,
} from "./user.service";
import { STRIPE_PUBLIC_KEY } from "../../../environment";

const api = express.Router();

api.get("/user", CheckAuth, async (req, res) => {
  try {
    const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { page, limit, pattern } = req.query;
    let results = null;

    if (pattern) {
      results = await findUsersByPattern({ creatorId, page, limit, pattern });
    } else {
      results = await getAllUser({ creatorId, page, limit });
    }

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/api-key", async (req, res) => {
  try {
    const apiKey = STRIPE_PUBLIC_KEY || null;
    return res.json(success({ apiKey }));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/cart-data", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results = await getCartData({ userId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/cart", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results = await getCart({ userId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/favor-data", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { type, page, limit, pattern, category } = req.query;
    const results = await getFavoriteEpisodes({
      userId,
      type,
      page,
      limit,
      pattern,
      category,
    });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/user/cart", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { cartItems } = req.body;
    const statusCode = await updateCart({ userId, cartItems });

    const result = statusCode > 0 ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/bookshelf-data", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { limit, page, pattern, category } = req.query;
    const results = await getBookshelfData({ userId, limit, page, pattern, category });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/bookshelf", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const results = await getBookshelf({ userId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/user/bookshelf", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { episodeId } = req.body;
    const statusCode = await updateBookshelf({ userId, episodeId });

    const result = statusCode > 0 ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/user/:userId/transaction", CheckAuth, async (req, res) => {
  try {
    const authId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
    const { userId } = req.params;
    const { page, limit } = req.query;
    const transactions = await getAllTransaction({
      authId,
      userId,
      page,
      limit,
    });
    return res.json(success(transactions));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/user/:userId/status", CheckAuth, async (req, res) => {
  try {
    const authId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    const { userId } = req.params;
    const { type } = req.body;

    const statusCode = await editUserStatus({ authId, userId, type });

    const result = statusCode > 0 ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put("/user/:userId", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    console.log(req.body);

    const { fullName, age, phoneNumber } = req.body;

    const statusCode = await editUser({ userId, fullName, age, phoneNumber });

    const result = statusCode > 0 ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post("/user", async (req, res) => {
  try {
    const {
      username,
      email,
      fullName,
      publicKey,
      encryptedPrivateKey,
      phoneNumber,
      age,
    } = req.body;

    const result = await createUser({
      username,
      email,
      fullName,
      publicKey,
      encryptedPrivateKey,
      phoneNumber,
      age,
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
