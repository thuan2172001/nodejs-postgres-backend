import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Comments } from '../models/comment';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateComments = async () => {
    try {
        const dataFile = await getCSVFiles('comments');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            const item = {
                commentId: field[header.indexOf('commentId')],
                userId: field[header.indexOf('userId')],
                serieId: field[header.indexOf('serieId')] || null, 
                episodeId: field[header.indexOf('episodeId')] || null,
                description: field[header.indexOf('description')] || null,
            };
            dataSeed.push(item);
        });

        await Comments.sync({ force: false }).then(() => {
            return Comments.bulkCreate(dataSeed);
        }).catch(err => console.log({ "likeErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};