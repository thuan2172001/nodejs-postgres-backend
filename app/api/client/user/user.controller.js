import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getCart } from "./user.service";

const api = express.Router();

api.get('/user/cart', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const results = await getCart({ userId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;