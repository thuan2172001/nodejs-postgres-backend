import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, getById, createSerie, editSerie
} from './serie.service';

const api = express.Router();

api.get('/serie', skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const results = await getAll({ userId, page, limit });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/serie/:serieId', skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const { serieId } = req.params;
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const results = await getById({ userId, serieId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/serie', async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const { cover, thumbnail, serieName, categoryId, description } = req.body;
    const results = await createSerie({ cover, thumbnail, serieName, categoryId, description, userId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/serie/:serieId', async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const { cover, thumbnail, serieName, categoryId, description } = req.body;
    const statusCode = await editSerie({ cover, thumbnail, serieName, categoryId, description, userId });
    const result = statusCode > 0 ? 'success' : 'failed';

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
