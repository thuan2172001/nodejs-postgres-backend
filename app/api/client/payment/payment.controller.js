import express from "express";
import { CheckAuth, skipGuestQuery } from "../../middlewares/auth.mid";
import CommonError from "../../library/error";
import { success } from "../../../utils/response-utils";
import {
  addPayment,
  checkoutOrder,
  getAllPaymentMethods,
  deletePayment,
} from "./payment.service";
import { setupPaymentIntent } from "./stripe.service";

const api = express.Router();

api.get("/payment", CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    const response = await getAllPaymentMethods({
      userId,
    });

    return res.json(success(response));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post("/payment", CheckAuth, async (req, res) => {
  try {
    const { paymentMethodInfo, nameOnCard, futureUsage } = req.body;
    const userInfo = req.userInfo.toJSON();

    const response = await addPayment({
      userInfo,
      paymentMethodInfo,
      nameOnCard,
      futureUsage,
    });

    return res.json(success(response));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete("/payment/:paymentMethodId", CheckAuth, async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";

    if (!paymentMethodId) {
      throw new Error("PAYMENT.NOT_FOUND");
    }

    const response = await deletePayment({
      userId,
      paymentMethodId,
    });

    return res.json(success(response));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get("/payment/create-setup-intent", CheckAuth, async (req, res) => {
  try {
    const userInfo = req.userInfo.toJSON();
    const response = await setupPaymentIntent({
      userInfo,
    });

    return res.json(success(response));
  } catch (err) {
    console.log(err.message);
    return CommonError(req, err, res);
  }
});

api.post("/payment/checkout", CheckAuth, async (req, res) => {
  try {
    const { cartList, payment, value } = req.body;
    const userInfo = req.userInfo.toJSON();

    const status = await checkoutOrder({
      cartList,
      payment,
      value,
      userInfo,
    });

    const result = status ? "success" : "failed";

    return res.json(success(result));
  } catch (err) {
    console.log(err.message);
    console.log(err);
    return CommonError(req, err, res);
  }
});

module.exports = api;
