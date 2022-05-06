import express from 'express';
import {
  deleteKey,
  upload,
  getSignedUrl,
  getListByPrefix,
  deleteListByPrefix,
} from '../../../services/s3/s3';
import { CheckAuth } from '../../middlewares/auth.mid';
import { badRequest, success } from '../../../utils/response-utils';
import CommonError from '../../library/error';
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const { Creators } = require('../../../models/creator');

const api = express.Router();
var uploadLocal = multer({ dest: 'uploads/' })

api.post('/uploadv3', uploadLocal.single('file'), async (req, res) => {
  try {
    const src = fs.createReadStream(req.file.path);
    const key = `${uuid.v4()}-${req.file.originalname.toString().replace(" ", "")}`;
    var dest = fs.createWriteStream('uploads/' + key);
    src.pipe(dest);
    src.on('end', function () {
      fs.unlinkSync(req.file.path);
      return res.json(success({ key }));
    });
    src.on('error', function (err) {
      return res.json(badRequest('FILE.UPLOAD.ERROR'))
    });
  } catch (err) {
    return CommonError(req, err, res);
  }
})

api.post('/upload', upload.any(), CheckAuth, async (req, res) => {
  const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

  const creator = await Creators.findOne({ where: { _id: userId } })

  if (!creator) throw new Error('FILE.UPLOAD.NO_PERMISSION')

  upload.single('file')(req, res, (err) => {
    if (err) return res.json(badRequest(err.message));

    if (!req.files) return res.json(badRequest('FILE.UPLOAD.FILE_IS_REQUIRED'));

    if (!req.files || req.files.length <= 0) {
      return res.json(badRequest('FILE.UPLOAD'))
    }
    console.log(req.files[0])
    const { key, location, pageNumber } = req.files[0];
    return res.json(success({ key, location, pageNumber }));
  });
});

api.post('/uploadv2', upload.any(), async (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.json(badRequest(err.message));

    if (!req.files) return res.json(badRequest('FILE.UPLOAD.FILE_IS_REQUIRED'));

    if (!req.files || req.files.length <= 0) {
      return res.json(badRequest('FILE.UPLOAD'))
    }
    console.log(req.files[0])
    const { key, location, pageNumber } = req.files[0];
    return res.json(success({ key, location, pageNumber }));
  });
});

api.get('/sign', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.json(badRequest('FILE.SIGN_FILE.MISSING_KEY'));

    const signedUrl = getSignedUrl(key);
    return res.json({ signedUrl });
  } catch (err) {
    console.log(err.message);
    return CommonError(req, err, res);
  }
});

api.post('/delete', async (req, res) => {
  try {
    const { prefix, key } = req.body;

    if (prefix === undefined && key === undefined)
      return res.json(badRequest('FILE.DELETE_FILE.MISSING_KEY'));

    const status = Promise.all([deleteListByPrefix(prefix), deleteKey(key)]);
    return res.json({ status });
  } catch (err) {
    console.log(err.message);
    return CommonError(req, err, res);
  }
});

api.get('/list', async (req, res) => {
  try {
    const { prefix } = req.query;
    const result = await getListByPrefix(prefix);
    res.json({ result });
  } catch (err) {
    console.log(err.message);
    return CommonError(req, err, res);
  }
});

module.exports = api;
