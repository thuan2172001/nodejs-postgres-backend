import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, getById
} from './category.service';

const api = express.Router();

api.get('/category', async (req, res) => {
  try {
    const results = await getAll();

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
