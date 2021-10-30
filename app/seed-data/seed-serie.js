import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Series } from '../models/serie';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateSerie = async () => {
    try {
        const dataFile = await getCSVFiles('series');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            const item = {
                serieId: field[header.indexOf('serieId')],
                serieName: field[header.indexOf('serieName')],
                categoryId: field[header.indexOf('categoryId')],
                description: field[header.indexOf('description')],
                cover: field[header.indexOf('cover')],
                thumbnail: field[header.indexOf('thumbnail')],
                isPublished: field[header.indexOf('isPublished')],
            };
            dataSeed.push(item);
        });

        await Series.sync({ force: false }).then(() => {
            return Series.bulkCreate(dataSeed);
        }).catch(err => console.log({"serieSeedErr" :err}));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};