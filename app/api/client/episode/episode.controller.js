import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getById, editEpisodeStatus, getFavorEpisodes, createEpisode, editEpisode } from "./episode.service";

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

api.post('/episode', CheckAuth, async (req, res) => {
    try {
        const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { name, chapter, key, pageNumber, description, serieId, thumbnail, price } = req.body;
        const result = await createEpisode({
            creatorId,
            name,
            chapter,
            key,
            pageNumber,
            description,
            serieId,
            thumbnail,
            price,
        })
        return res.json(success(result));
    } catch (err) {
        console.log(err.message)
        console.log(err.stack)
        return CommonError(req, err, res);
    }
});

api.put('/episode/:episodeId', CheckAuth, async (req, res) => {
    try {
        const creatorId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { episodeId } = req.params;
        const { name, chapter, key, pageNumber, description, thumbnail, price } = req.body;
        const result = await editEpisode({
            creatorId,
            episodeId,
            name,
            chapter,
            key,
            pageNumber,
            description,
            thumbnail,
            price,
        })
        return res.json(success(result));
    } catch (err) {
        console.log(err.message)
        console.log(err.stack)
        return CommonError(req, err, res);
    }
});


module.exports = api;