import { CheckAuth } from '../../../middlewares/auth.mid';

const api = require('express').Router();
const {
  success,
  serverError,
} = require('../../../../utils/response-utils');
const { Users } = require('../../../../models/user');
const { Creators } = require('../../../../models/creator');
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

      const creator = await Creators.findOne({ where: { username } });

      if (creator) {
        return res.json(success(creator));
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

    const creator = await Creators.findOne({
      where: { username: req.body.certificateInfo.username },
    });

    if (creator) {
      return res.json(success(creator));
    }

    throw new Error('AUTH.ERROR.USER_NOT_FOUND');
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.get('/auth/profile', CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

    const user = await Users.findOne({
      where: { _id: userId },
    });

    if (user) {
      return res.json(success(user));
    }

    const creator = await Creators.findOne({
      where: { _id: userId },
    });

    if (creator) {
      return res.json(success(creator));
    }

    throw new Error('AUTH.ERROR.USER_NOT_FOUND');
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
})

api.put('/auth/password', CheckAuth, async (req, res) => {
  try {
    const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';
    const { publicKey, encryptedPrivateKey } = req.body;

    if (!publicKey || !encryptedPrivateKey) throw new Error('AUTH.ERROR.BODY_MISSING_FIELD')

    const user = await Users.findOne({
      where: { _id: userId },
    });

    if (user) {
      const statusCode = await Users.update({ publicKey, encryptedPrivateKey }, { where: { _id: userId } })
      const result = statusCode > 0 ? 'success' : 'failed';
      return res.json(success(result))
    }

    const creator = await Creators.findOne({
      where: { _id: userId },
    });

    if (creator) {
      const statusCode = await Users.update({ publicKey, encryptedPrivateKey }, { where: { _id: userId } })
      const result = statusCode > 0 ? 'success' : 'failed';
      return res.json(success(result))
    }

    throw new Error('AUTH.ERROR.USER_NOT_FOUND');
  } catch (err) {
    return res.json(serverError('AUTH.ERROR.CHANGE_PASSWORD.FAILED'));
  }
})

module.exports = api;
