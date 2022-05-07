import faker from 'faker';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import { Conversations } from '../models/conversation';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateConversation = async () => {
    try {
        const dataFile = await getCSVFiles('conversations');

        const { header, content } = await getContentCSVFiles(dataFile[0], ';');

        let dataSeed = []

        await Promise.each(content, async (line) => {
            const field = cleanField(line.split(';'));
            const initialMessages = [
                { sendBy: "sender", body: "Xin chao cac ban !", time: new Date().getTime(), seen: false }, 
                { sendBy: "receiver", body: "Xin chao ban !", time: new Date().getTime(), seen: false }, 
            ];

            const item = {
                conversationId: field[header.indexOf('conversationId')],
                sender: field[header.indexOf('sender')],
                receiver: field[header.indexOf('receiver')],
                messages: initialMessages,
            };
            dataSeed.push(item);
        });

        await Conversations.sync({ force: false }).then(() => {
            return Conversations.bulkCreate(dataSeed);
        }).catch(err => console.log({ "conversationSeedErr": err }));

        return dataSeed;

    } catch (err) {
        throw new Error(err.message);
    }
};