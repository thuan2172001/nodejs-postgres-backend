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
    console.log({ username });
    if (!username) {
      throw new Error('AUTH.ERROR.INVALID_REQUEST');
    } else {
      const user = await Users.findOne({ where: { username } });
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
      where: { username: req.body.certificateInfo.username },
    });
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
