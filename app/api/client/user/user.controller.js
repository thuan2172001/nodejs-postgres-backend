import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getCart, updateCart, getCartData, editUser, createUser, editUserStatus } from "./user.service";

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

        const result = statusCode > 0 ? 'success' : 'failed';

        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
});


api.put('/user/status', CheckAuth, async (req, res) => {
    try {
        const authId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

        const { username, type } = req.body;

        const statusCode = await editUserStatus({ authId, username, type });

        const result = statusCode > 0 ? 'success' : 'failed';

        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.put('/user/:userId', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

        console.log(req.body)

        const { fullName, age, phoneNumber } = req.body;

        const statusCode = await editUser({ userId, fullName, age, phoneNumber });

        const result = statusCode > 0 ? 'success' : 'failed';

        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
})

api.post('/user', async (req, res) => {
    try {
        const { username, email, fullName, publicKey, encryptedPrivateKey, phoneNumber, age } = req.body;

        const result = await createUser({ username, email, fullName, publicKey, encryptedPrivateKey, phoneNumber, age });

        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
})


module.exports = api;