import { CheckAuth } from '../../../middlewares/auth.mid';

const api = require('express').Router();
const {
  success,
  serverError,
} = require('../../../../utils/response-utils');
const { Users } = require('../../../../models/user');
const { error } = require('../../../../services/logger');

api.post('/auth/credential', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      throw new Error('AUTH.ERROR.INVALID_REQUEST');
    } else {
      const user = await Users.findOne({ username });
      console.log({ user })
      if (user) {
        return res.json(success(user));
      }
      throw new Error('AUTH.ERROR.USER_NOT_FOUND');
    }
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.post('/auth/ping', CheckAuth, async (req, res) => {
  try {
    const user = await Users.findOne({
      username: req.body.certificateInfo.username,
    }).populate(['role']);
    console.log({ user })
    if (user) {
      return res.json(success(user));
    }
    throw new Error('AUTH.ERROR.USER_NOT_FOUND');
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

module.exports = api;
