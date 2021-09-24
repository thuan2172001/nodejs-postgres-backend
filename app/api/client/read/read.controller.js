import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getSignedUrl
} from './read.service';

const api = express.Router();

api.get('/read/:episodeId', skipGuestQuery(CheckAuth), async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const { episodeId } = req.params;
    const data = await getSignedUrl({
      userId,
      episodeId
    });
    return res.json(success({ serie }));
  } catch (err) {
    console.log(err.message)
    return CommonError(req, err, res);
  }
});


module.exports = api;
