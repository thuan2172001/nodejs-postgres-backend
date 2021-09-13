import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Carts } from '../models/cart';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateCarts = async () => {
    try {
        const dataFile = await getCSVFiles('carts');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            console.log({ field })

            const cartItemsData = field[header.indexOf('cartItems')];

            const cartItems = cartItemsData.slice(1, cartItemsData.length - 1).split(',');

            const item = {
                cartId: field[header.indexOf('cartId')],
                userId: field[header.indexOf('userId')],
                cartItems: cartItems,
            };
            dataSeed.push(item);
        });

        await Carts.sync({ force: false }).then(() => {
            return Carts.bulkCreate(dataSeed);
        }).catch(err => console.log({ "cartSeedErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};