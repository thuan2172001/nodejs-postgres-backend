import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getById } from "./episode.service";

const api = express.Router();

api.get('/episode/:episodeId', skipGuestQuery(CheckAuth), async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { episodeId } = req.params;
        const results = await getById({ userId, episodeId });

        return res.json(success(results));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;