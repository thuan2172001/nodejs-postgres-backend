import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Bookshelves } from '../models/bookshelf';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateBookshelf = async () => {
    try {
        const dataFile = await getCSVFiles('bookshelves');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            console.log({ field })

            const itemsData = field[header.indexOf('bookshelfItems')];

            const items = itemsData.slice(1, itemsData.length - 1).split(',');

            const item = {
                userId: field[header.indexOf('userId')],
                bookshelfItems: items,
            };
            dataSeed.push(item);
        });

        await Bookshelves.sync({ force: false }).then(() => {
            return Bookshelves.bulkCreate(dataSeed);
        }).catch(err => console.log({ "bookshelfSeedErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};