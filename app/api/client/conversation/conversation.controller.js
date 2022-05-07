import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
    success,
} from '../../../utils/response-utils';
import { getListConversation, createMessage, deleteConversation, getConversation } from './conversation.service';

const api = express.Router();

api.get('/conversation', CheckAuth, async (req, res) => {
    try {
        try {
            const { page, limit } = req.query;
            const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
            const results = await getListConversation({ userId, page, limit })
            return res.json(success(results));
        } catch (err) {
            return CommonError(req, err, res);
        }
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.get('/conversation/:conversationId', CheckAuth, async (req, res) => {
    try {
        try {
            const { conversationId } = req.params;
            const { limit } = req.query
            const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
            const results = await getConversation({ userId, conversationId, limit })
            return res.json(success(results));
        } catch (err) {
            return CommonError(req, err, res);
        }
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.delete('/conversation/:conversationId', CheckAuth, async (req, res) => {
    try {
        try {
            const { conversationId } = req.params;
            const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
            const results = await deleteConversation({ userId, conversationId })
            return res.json(success(results));
        } catch (err) {
            return CommonError(req, err, res);
        }
    } catch (err) {
        return CommonError(req, err, res);
    }
});

api.post('/chat', CheckAuth, async (req, res) => {
    try {
        try {
            const { receiver, message } = req.body;
            const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : "";
            const results = await createMessage({ userId, receiver, message })
            return res.json(success(results));
        } catch (err) {
            return CommonError(req, err, res);
        }
    } catch (err) {
        return CommonError(req, err, res);
    }
});

module.exports = api;