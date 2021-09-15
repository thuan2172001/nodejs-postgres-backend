import { Users } from "../../../models/user";
import { Carts } from "../../../models/cart";
import { Episodes } from "../../../models/episode";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getCartData = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const cart = await Carts.findOne({ where: { userId } });

    const episodesId = cart.dataValues?.cartItems;

    let result = [];

    await Promise.all(episodesId.map(async (episodeId) => {
        const episodeData = await Episodes.findOne({ where: { episodeId } })
        result.push(episodeData.dataValues)
    }))

    return result;
}

export const getCart = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const cart = await Carts.findOne({ where: { userId } });

    const episodesId = cart.dataValues?.cartItems || [];

    return episodesId;
}

export const updateCart = async ({ userId, cartItems }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const cart = await Carts.findOne({ where: { userId } });

    if (!cart) {
        const newCart = await Carts.create({
            cartId: uuidv1(),
            userId,
            cartItems,
        })
        return newCart;
    }

    const result = await Carts.update({ cartItems: cartItems }, { where: { userId: userId } })

    return result;
}