import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateEpisode = async () => {
    try {
        const dataFile = await getCSVFiles('episodes');

        const { header, content } = await getContentCSVFiles(dataFile[0]);

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(','));

            const item = {
                chapter: field[header.indexOf('chapter')],
                name: field[header.indexOf('name')],
                key: field[header.indexOf('key')],
                pageNumber: field[header.indexOf('pageNumber')],
                _id: field[header.indexOf('_id')],
                description: field[header.indexOf('description')],
                serie: field[header.indexOf('serie')],
                thumbnail: field[header.indexOf('thumbnail')],
                price: field[header.indexOf('price')],
                timeFirstPublished: field[header.indexOf('timeFirstPublished')],
            };
            dataSeed.push(item);
        });

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};