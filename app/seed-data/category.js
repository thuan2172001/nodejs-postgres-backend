import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Categories } from '../models/category';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateCategory = async () => {
    try {
        const dataFile = await getCSVFiles('categories');

        const { header, content } = await getContentCSVFiles(dataFile[0]);

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(','));

            const item = {
                categoryId: field[header.indexOf('categoryId')],
                categoryName: field[header.indexOf('categoryName')],
            };
            dataSeed.push(item);
        });

        await Categories.sync({ force: false }).then(() => {
            return Categories.bulkCreate(dataSeed);
        }).catch(err => console.log({"categorySeedErr" :err}));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};