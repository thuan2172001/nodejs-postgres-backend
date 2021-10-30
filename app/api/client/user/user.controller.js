import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success, } from '../../../utils/response-utils';
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
    getFavoriteEpisodes
} from "./user.service";
import { STRIPE_PUBLIC_KEY } from '../../../environment';

const api = express.Router();

api.get('/user/api-key', async (req, res) => {
    try {
        const apiKey = STRIPE_PUBLIC_KEY || null;
        return res.json(success({ apiKey })
        );
    } catch (err) {
        return CommonError(req, err, res);
    }
});

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

api.get('/user/favor-data', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { type } = req.query;
        console.log({ type })
        const results = await getFavoriteEpisodes({ userId, type });

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

api.get('/user/bookshelf-data', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const results = await getBookshelfData({ userId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.get('/user/bookshelf', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const results = await getBookshelf({ userId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.put('/user/bookshelf', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { episodeId } = req.body
        const statusCode = await updateBookshelf({ userId, episodeId });

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