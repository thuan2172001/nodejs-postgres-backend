
import { Conversations } from "../../../models/conversation";
import { Users } from "../../../models/user";
import { Op } from "sequelize";

export const getListConversation = async ({
    userId = null,
    page = 1,
    limit = 10,
}) => {
    let conversations = await Conversations.findAndCountAll({
        where: {
            [Op.or]: [{ sender: userId }, { receiver: userId }]
        },
        offset: (page - 1) * limit,
        limit: limit,
        order: [["updatedAt", "desc"]],
    })

    return {
        data: conversations.rows,
        total: conversations.count
    }
};


export const getConversation = async ({
    userId = null,
    conversationId,
    limit = 20,
}) => {
    let conversations = await Conversations.findOne({
        where: {
            conversationId,
            [Op.or]: [{ sender: userId }, { receiver: userId }]
        },
    })

    if (!conversations) {
        throw new Error("CONVERSATION.CONVERSATION_NOT_FOUND");
    }

    let messages = [...conversations.messages];

    const first = Math.max(messages.length - limit, 0);

    messages = messages.slice(first)

    return {
        ...conversations.defaultValue,
        messages
    }
};

export const createMessage = async ({
    userId = null,
    receiver,
    message,
}) => {
    let conversation = await Conversations.findOne({
        where: {
            [Op.or]: [{ sender: userId, receiver: receiver }, { receiver: userId, sender: receiver }]
        },
    })

    const userInfo = await Users.findOne({ where: { _id: userId } });

    const messageInfo = {
        sendBy: userInfo ? "sender" : "receiver",
        body: message,
        time: new Date().getTime(),
        seen: false,
    }

    if (!conversation) {
        const conversation = await Conversations.create({
            sender: userInfo ? userId : receiver,
            receiver: userInfo ? receiver : userId,
            messages: [messageInfo]
        })

        return conversation;
    }

    const messages = conversation.messages;
    const newMessages = [...messages, messageInfo]
    conversation.messages = newMessages;
    conversation.changed("messages", true);
    await conversation.save();
    return conversation;
};

export const deleteConversation = async ({
    userId,
    conversationId,
}) => {
    let conversation = await Conversations.findOne({
        where: {
            conversationId,
        },
    })
    let res = await conversation.destroy();
    return res;
};  