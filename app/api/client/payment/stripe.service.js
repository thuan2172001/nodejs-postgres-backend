
const { STRIPE_TOKEN, STRIPE_API_KEY } = require('../../../environment');
const axios = require('axios');
const Stripe = require('stripe');
const qs = require('qs');
const User = require('../../../models/user');

export const getCustomerPaymentMethod = async ({ customerID }) => {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerID,
        type: 'card',
    });

    return paymentMethods.data;
};

export const createStripeAccount = async ({ email, metadata }) => {
    const data = qs.stringify({
        email,
        metadata,
    });

    const config = {
        method: 'POST',
        url: 'https://api.stripe.com/v1/customers',
        headers: {
            Authorization: `Basic ${STRIPE_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };

    const response = await axios(config).catch((err) =>
        JSON.stringify(err.response)
    );

    return response.data;
};

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