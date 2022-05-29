
const { STRIPE_TOKEN, STRIPE_API_KEY } = require('../../../environment');
const axios = require('axios');
const Stripe = require('stripe');
const qs = require('qs');
const { Users } = require('../../../models/user');
const { PaymentMethods } = require('../../../models/payment_method');

const stripe = Stripe(STRIPE_API_KEY);

// get all payment methods
export const getCustomerPaymentMethod = async ({ customerID }) => {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerID,
        type: 'card',
    });

    return paymentMethods.data;
};

// call when create new user
export const createStripeAccount = async ({ email, metadata }) => {
    const data = qs.stringify({
        email,
        metadata,
    });

    const customer = await stripe.customers.create({
        email
    }, { stripeAccount: "acct_1JIoLaCSPkT4oU50" })

    // const config = {
    //     method: 'POST',
    //     url: 'https://api.stripe.com/v1/customers',
    //     headers: {
    //         Authorization: `Basic ${STRIPE_TOKEN}`,
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     data: data,
    // };

    // const response = await axios(config).catch((err) =>
    //     JSON.stringify(err.response)
    // );
    console.log({ customer })
    return customer;
    // return response?.data;
};

// delete duplicated payment methods
export const deduplicatePaymentMethods = async ({
    customerID: customer,
    type = 'card',
}) => {
    const fingerprints = [];

    const { data: paymentMethods } = await stripe.paymentMethods.list({
        customer,
        type,
    });

    const sortedPaymentMethods = paymentMethods
        ? paymentMethods.sort((a, b) => a.created - b.created)
        : [];

    for (const method of sortedPaymentMethods) {
        if (fingerprints.includes(method[type].fingerprint)) {
            await stripe.paymentMethods.detach(method.id);

            console.log(`Detached duplicate payment method ${method.id}.`);
        } else {
            fingerprints.push(method[type].fingerprint);
        }
    }
};

// call when set up new card
export const setupPaymentIntent = async ({ userInfo }) => {
    if (userInfo.role !== 'user') {
        throw new Error('STRIPE.SETUP_PAYMENT.NOT_USER_ROLE');
    }

    const user = await Users.findOne({ where: { _id: userInfo._id } });

    if (!user) {
        throw new Error('STRIPE.SETUP_PAYMENT.USER.NOT_FOUND');
    }

    const { stripeAccount } = user;

    if (!stripeAccount) {
        throw new Error('STRIPE.SETUP.PAYMENT_INVALID');
    }

    console.log({ stripeAccount })

    return stripe.setupIntents.create({
        payment_method_types: ['card'],
        customer: stripeAccount,
        usage: 'on_session',
    });
};

// call when remove cart
export const detachPaymentMethod = async ({ paymentMethodId }) => {
    return stripe.paymentMethods.detach(paymentMethodId);
};

export const checkoutSession = async (sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session
}

export const createCheckoutSession = async (quantity, price) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Episodes',
                    },
                    unit_amount: price,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });
    return session;
};

export const createCharge = async (paymentInfo, price, transation) => {
    let { number, expiredMonth, expiredYear, cvc } = paymentInfo.params;

    const token = await stripe.tokens.create({
        card: {
            number,
            exp_month: expiredMonth,
            exp_year: expiredYear,
            cvc
        },
    });

    if (!token) throw new Error("cannot_create_token");

    console.log({ token, transation })

    const charge = await stripe.charges.create({
        amount: price,
        currency: 'usd',
        source: token.id,
        description: `Charge for transaction ${transation.transactionId}`,
    });
    console.log({ charge });
    return charge;

}