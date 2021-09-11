import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, getById, create, update, remove, removeById,
} from './admin.service';

const api = express.Router();

api.get('/admin/user', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Users');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/admin/episode', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Episodes');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
