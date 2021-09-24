const axios = require('axios');
const Stripe = require('stripe');
const qs = require('qs');
const {
  getCustomerPaymentMethod,
  deduplicatePaymentMethods,
  // detachPaymentMethod,
  // checkout,
} = require('./stripe.service');

const { hookPromise } = require('../../library/customPromise');
const { isValidString } = require('../../../utils/validate-utils');

export const addPayment = async ({
  userInfo,
  paymentMethodInfo,
  nameOnCard,
  futureUsage = true,
}) => {
  console.log({ userInfo, paymentMethodInfo, nameOnCard, futureUsage })

  if (!nameOnCard) {
    throw new Error('PAYMENT.INVALID_CARD_NAME');
  }

  const role = userInfo?.role;

  if (role !== 'user') {
    throw new Error('PAYMENT.NOT_USER_ROLE');
  }

  const user = await Users.findOne({ where: { _id: userInfo._id } })

  if (!user) {
    throw new Error('PAYMENT.USER_NOT_FOUND')
  }

  if (
    !paymentMethodInfo ||
    !paymentMethodInfo.payment_method ||
    paymentMethodInfo.status !== 'succeeded'
  ) {
    throw new Error('PAYMENT.SET_UP_FAILED');
  }

  const paymentMethods = await getCustomerPaymentMethod({
    customerID: user.stripeAccount,
  });

  const paymentMethodsFingerprint = paymentMethods
    .filter((method) => isValidString(method.card.fingerprint))
    .map((method) => method.card.fingerprint);

  if (
    paymentMethodsFingerprint.length !== new Set(paymentMethodsFingerprint).size
  ) {
    await deduplicatePaymentMethods({ customerID: customer.stripeAccount });

    throw new Error('PAYMENT.CARD_EXISTED');
  }

  return [];

  // const existingPaymentMethod = await PaymentMethod.findOne({
  //   'card.payment_method': paymentMethodInfo.payment_method,
  // });

  // if (existingPaymentMethod) {
  //   throw new Error('PAYMENT.EXISTED');
  // }

  // const newPaymentMethod = new PaymentMethod({
  //   nameOnCard: nameOnCard.toUpperCase(),
  //   card: paymentMethodInfo,
  //   user: customer._id,
  //   futureUsage,
  // });

  // const savedPaymentMethod = await newPaymentMethod.save();

  // const { nModified, ok } = await Customer.updateOne(
  //   {
  //     _id: customer._id,
  //   },
  //   {
  //     $push: { paymentMethods: savedPaymentMethod._id },
  //   }
  // );

  // if (nModified !== 1 || ok !== 1) {
  //   throw new Error('PAYMENT.ADD_FAILED');
  // }

  // return savedPaymentMethod;
};

export const getAllPaymentMethods = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } })

  if (!user) {
    throw new Error('PAYMENT.USER.NOT_FOUND');
  }

  const { stripeAccount } = user;

  if (!stripeAccount) {
    throw new Error('PAYMENT.STRIPE_ACCOUNT_NOT_FOUND');
  }

  return getCustomerPaymentMethod({
    customerID: stripeAccount,
  });
}