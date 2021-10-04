import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Episodes } from '../models/episode';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateEpisode = async () => {
    try {
        const dataFile = await getCSVFiles('episodes');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            const item = {
                chapter: field[header.indexOf('chapter')],
                name: field[header.indexOf('name')],
                key: field[header.indexOf('key')],
                pageNumber: field[header.indexOf('pageNumber')],
                episodeId: field[header.indexOf('episodeId')],
                description: field[header.indexOf('description')],
                serieId: field[header.indexOf('serieId')],
                thumbnail: field[header.indexOf('thumbnail')],
                price: field[header.indexOf('price')],
                likeInit: field[header.indexOf('likeInit')],
                isPublished: true,
            };
            dataSeed.push(item);
        });

        await Episodes.sync({ force: false }).then(() => {
            return Episodes.bulkCreate(dataSeed);
        }).catch(err => console.log({"episodeSeedErr" :err}));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};