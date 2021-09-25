import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getById, editEpisodeStatus, getFavorEpisodes } from "./episode.service";

const api = express.Router();

api.post('/episode/status', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { type, episodeId } = req.body;
        const statusCode = await editEpisodeStatus({ episodeId, type, userId });
        const result = statusCode > 0 ? 'success' : 'failed';

        return res.json(success(result));
    } catch (err) {
        return CommonError(req, err, res);
    }
})

api.get('/episode/favorite', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const episodes = await getFavorEpisodes({ userId });

        return res.json(success(episodes));
    } catch (err) {
        return CommonError(req, err, res);
    }
})

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