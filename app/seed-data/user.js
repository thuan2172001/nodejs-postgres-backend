import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateUser = async () => {
    try {
        const dataFile = await getCSVFiles('users');

        const { header, content } = await getContentCSVFiles(dataFile[0]);

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(','));

            const item = {
                userId: field[header.indexOf('userId')],
                username: field[header.indexOf('username')],
                fullName: field[header.indexOf('fullName')],
                email: field[header.indexOf('email')],
                publicKey: 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
                encryptedPrivateKey:
                    'U2FsdGVkX1849aMg8O6GLRVrFSLd2aQI4cRaS4Ql2nZr8p+smv5O9koFn+J6EkcwaZF6u8dGb3tJEXg35q0raA==',
            };
            dataSeed.push(item);
        });

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};