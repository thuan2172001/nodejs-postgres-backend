
import { Conversations } from "../../../models/conversation";
import { Users } from "../../../models/user";
import { Creators } from "../../../models/creator";
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

    let results = [];

    await Promise.all(
        conversations.rows.map(async (conversation) => {
            let value = conversation;
            
            let message = conversation.messages;
            let lastMessage = message.slice(message.length - 1)[0].body

            let friendId = conversation.sender === userId ? conversation.receiver : conversation.sender;
            let [userFriend, creatorFriend] = await Promise.all([
                Users.findOne({
                    where: {
                        _id: friendId
                    },
                    attributes: ["_id", "fullName"]
                }),
                Creators.findOne({
                    where: {
                        _id: friendId
                    },
                    attributes: ["_id", "fullName", "avatar"]
                })
            ]);

            let newData = {
                ...value.dataValues,
                friendInfo: userFriend ?? creatorFriend,
                lastMessage,
                messages: []
            }

            results.push(newData);
        }));

    return {
        data: results,
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

export const getConversationId = async ({
    userId,
    receiver,
}) => {
    let conversation = await Conversations.findOne({
        where: {
            [Op.or]: [{ sender: userId, receiver: receiver }, { receiver: userId, sender: receiver }]
        },
    })
    const userInfo = await Users.findOne({ where: { _id: userId } });
    const userReceiverInfo = await Users.findOne({ where: { _id: receiver } });
    const creatorInfo = await Creators.findOne({ where: { _id: receiver } });
    if (!userReceiverInfo && !creatorInfo) {
        throw new Error("invalid_receiver");
    }
    if (!conversation) {
        conversation = await Conversations.create({
            sender: userInfo ? userId : receiver,
            receiver: userInfo ? receiver : userId,
            messages: []
        })
    }
    return conversation;
};  