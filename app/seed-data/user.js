import faker from 'faker';
// import { Users } from '../models/user';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateUser = async () => {
    try {
        const userFile = await getCSVFiles('users');

        const { header, content } = await getContentCSVFiles(userFile[0]);

        let userSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(','));

            const user = {
                userId: field[header.indexOf('userId')],
                username: field[header.indexOf('username')],
                fullName: field[header.indexOf('fullName')],
                email: field[header.indexOf('email')],
                publicKey: 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
                encryptedPrivateKey:
                    'U2FsdGVkX1849aMg8O6GLRVrFSLd2aQI4cRaS4Ql2nZr8p+smv5O9koFn+J6EkcwaZF6u8dGb3tJEXg35q0raA==',
            };
            userSeed.push(user);
        });

        console.log("debug here");

        return userSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};