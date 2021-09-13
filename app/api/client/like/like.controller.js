import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { likeToggle } from "./like.service";

const api = express.Router();

api.post('/like/like', CheckAuth, async (req, res) => {
    try {
        const { episodeId, serieId } = req.body;
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

        const statusCode = await likeToggle({ userId, serieId, episodeId, status: 'LIKE' });

        const result = statusCode ? "success" : "failed";

        return res.json(success({ "data": result }));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.post('/like/unlike', CheckAuth, async (req, res) => {
    try {
        const { episodeId, serieId } = req.body;
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

        const statusCode = await likeToggle({ userId, serieId, episodeId, status: 'UNLIKE' });

        const result = statusCode ? "success" : "failed";

        return res.json(success({ "data": result }));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;