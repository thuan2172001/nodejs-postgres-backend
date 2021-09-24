import express from 'express';
import { CheckAuth, skipGuestQuery } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
	success,
} from '../../../utils/response-utils';
import {
	addPayment, getAllPaymentMethods,
} from './payment.service';

const api = express.Router();

api.get('/payment', CheckAuth, async (req, res) => {
	try {
		const userId = req.userInfo && req.userInfo._id ? req.userInfo._id : '';

		const response = await getAllPaymentMethods({
			userId,
		});

		return res.json(success(response));
	} catch (err) {
		return CommonError(req, err, res);
	}
});

api.post('/payment', CheckAuth, async (req, res) => {
	try {
		const { paymentMethodInfo, nameOnCard, futureUsage } = req.body;
		const userInfo = req.userInfo.toJSON();

		const response = await addPayment({
			userInfo,
			paymentMethodInfo,
			nameOnCard,
			futureUsage,
		});

		return res.json(success(response));
	} catch (err) {
		return CommonError(req, err, res);
	}
});

module.exports = api;
