import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Likes } from '../models/like';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateLikes = async () => {
    try {
        const dataFile = await getCSVFiles('likes');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            const item = {
                userId: field[header.indexOf('userId')],
                serieId: field[header.indexOf('serieId')] || null, 
                episodeId: field[header.indexOf('episodeId')] || null,
            };
            dataSeed.push(item);
        });

        await Likes.sync({ force: false }).then(() => {
            return Likes.bulkCreate(dataSeed);
        }).catch(err => console.log({ "likeSeedErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};