import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Codes } from '../models/code';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateCode = async () => {
    try {
        const dataFile = await getCSVFiles('codes');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));

            const item = {
                codeId: field[header.indexOf('codeId')],
                userId: field[header.indexOf('userId')],
            };
            dataSeed.push(item);
        });

        await Codes.sync({ force: false }).then(() => {
            return Codes.bulkCreate(dataSeed);
        }).catch(err => console.log({ "codeSeedErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};