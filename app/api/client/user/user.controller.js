import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getCart, updateCart, getCartData } from "./user.service";

const api = express.Router();

api.get('/user/cart-data', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const results = await getCartData({ userId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.get('/user/cart', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const results = await getCart({ userId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.put('/user/cart', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { cartItems } = req.body
        const statusCode = await updateCart({ userId, cartItems });

        const results = statusCode > 0 ? 'success' : 'failed';

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;