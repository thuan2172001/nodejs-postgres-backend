import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getAll
} from './admin.service';

const api = express.Router();

api.get('/admin/users', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Users');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/admin/episodes', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Episodes');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/admin/categories', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Categories');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/admin/series', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Series');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/admin/bookshelves', async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args, 'Bookshelves');

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
