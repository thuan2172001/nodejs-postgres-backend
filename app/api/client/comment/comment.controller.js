import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { createComment, deleteComment, editComment } from './comment.service';

const api = express.Router();

api.post('/comment', CheckAuth, async (req, res) => {
    try {
        const { episodeId, serieId, description } = req.body;
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const result = await createComment({ userId, episodeId, serieId, description });

        return res.json(success({ "data": result }));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.put('/comment', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { commentId, description } = req.body;
        const comment = await editComment({ userId, commentId, description });
        return res.json(success({ "data": comment }));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.delete('/comment', CheckAuth, async (req, res) => {
    try {
        const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
        const { commentId } = req.body;

        const statusCode = await deleteComment({ userId, commentId });

        const result = statusCode ? "success" : "failed";

        return res.json(success({ "data": result }));
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;