const axios = require("axios");
const Stripe = require("stripe");
const qs = require("qs");
const {
  getCustomerPaymentMethod,
  deduplicatePaymentMethods,
  detachPaymentMethod,
  // checkout,
} = require("./stripe.service");
const { Users } = require("../../../models/user");
const { Bookshelves } = require("../../../models/bookshelf");
const { Carts } = require("../../../models/cart");
const { PaymentMethods } = require("../../../models/payment_method");
const { Transactions } = require("../../../models/transaction");
const { Episodes } = require("../../../models/episode");
const { isValidString } = require("../../../utils/validate-utils");
const uuidv1 = require("uuidv1");

export const addPayment = async ({
  userInfo,
  paymentMethodInfo,
  nameOnCard,
  futureUsage = true,
}) => {
  if (!nameOnCard) {
    throw new Error("PAYMENT.INVALID_CARD_NAME");
  }

  const role = userInfo?.role;

  if (role !== "user") {
    throw new Error("PAYMENT.NOT_USER_ROLE");
  }

  const user = await Users.findOne({ where: { _id: userInfo._id } });

  if (!user) {
    throw new Error("PAYMENT.USER_NOT_FOUND");
  }

  if (
    !paymentMethodInfo ||
    !paymentMethodInfo.payment_method ||
    paymentMethodInfo.status !== "succeeded"
  ) {
    throw new Error("PAYMENT.SET_UP_FAILED");
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
    await deduplicatePaymentMethods({ customerID: user.stripeAccount });

    throw new Error("PAYMENT.CARD_EXISTED");
  }

  const paymentStripeId = paymentMethodInfo.payment_method || "";

  const allCard = await getAllPaymentMethods({ userId: userInfo._id });

  const card = allCard.filter((card) => card.id === paymentStripeId);

  if (card.length < 0) {
    throw new Error("PAYMENT.CARD_NOT_EXISTED_IN_STRIPE");
  }

  console.log(allCard);

  await PaymentMethods.create({
    paymentId: card[0]["id"],
    nameOnCard,
    card: card[0],
    userId: userInfo._id,
    futureUsage,
  });

  return card[0];
};

export const getAllPaymentMethods = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) {
    throw new Error("PAYMENT.USER.NOT_FOUND");
  }

  const { stripeAccount } = user;

  if (!stripeAccount) {
    throw new Error("PAYMENT.STRIPE_ACCOUNT_NOT_FOUND");
  }

  // const payments = await PaymentMethods.findAll({
  //   where: {
  //     userId: user._id
  //   }
  // })

  // return payments;

  return getCustomerPaymentMethod({
    customerID: stripeAccount,
  });
};

export const getAllPaymentsLocal = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) {
    throw new Error("PAYMENT.USER.NOT_FOUND");
  }

  const { stripeAccount } = user;

  if (!stripeAccount) {
    throw new Error("PAYMENT.STRIPE_ACCOUNT_NOT_FOUND");
  }

  const payments = await PaymentMethods.findAll({
    where: {
      userId: user._id
    }
  })

  return payments;
};

export const deletePayment = async ({ userId, paymentMethodId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) {
    throw new Error("PAYMENT.USER.NOT_FOUND");
  }

  const { stripeAccount } = user;

  if (!stripeAccount) {
    throw new Error("PAYMENT.STRIPE_ACCOUNT_NOT_FOUND");
  }

  const status = await detachPaymentMethod({ paymentMethodId });
  await PaymentMethods.destroy({
    where: {
      paymentId: paymentMethodId,
    }
  })

  return status;
};

export const checkoutOrder = async ({
  cartList,
  payment,
  value = 999,
  userInfo,
}) => {
  if (!userInfo) throw new Error("PAYMENT.CHECKOUT.NOT_AN_USER");

  const user = await Users.findOne({ where: { _id: userInfo._id } });

  if (!user) throw new Error("PAYMENT.CHECKOUT.USER_NOT_FOUND");

  if (!payment) throw new Error("PAYMENT.PAYMENT_METHOD_REQUIRED");

  const bookshelf = await Bookshelves.findOne({ where: { userId: user._id } });

  const bookshelfItems = bookshelf ? bookshelf.dataValues?.bookshelfItems : [];

  const episodeInfos = await Episodes.findAll({
    where: {
      episodeId: bookshelfItems
    }
  })

  const newBookshelfItems = [...new Set([...bookshelfItems, ...cartList])];

  let result;

  if (!bookshelf) {
    const newBookshelf = await Bookshelves.create({
      userId: user._id,
      bookshelfItems: newBookshelfItems,
    });
    newBookshelf ? (result = [1]) : [0];
  } else {
    result = await Bookshelves.update(
      { bookshelfItems: newBookshelfItems },
      { where: { userId: user._id } }
    );
  }

  const cart = await Carts.findOne({ where: { userId: user._id } });

  const cartItems = cart ? cart.dataValues?.cartItems : [];

  const newCartItems = cartItems.filter((ele) => {
    return cartList.indexOf(ele) < 0;
  });

  await Promise.all([
    episodeInfos.map(async (e) => {
      episodeInfos.soldQuantity++;
      e.save();
    })
  ])

  await Carts.update(
    { cartItems: newCartItems },
    { where: { userId: user._id } }
  );

  const transation = await Transactions.create({
    transactionId: uuidv1(),
    userId: user._id,
    paymentId: payment,
    value: value,
    items: cartList
  })

  console.log({ transation })
  return result;
};
