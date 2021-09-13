import { Users } from "../../../models/user";
import { Carts } from "../../../models/cart";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getCart = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const cart = await Carts.findOne({ where: { userId } });

    const result = cart.dataValues?.cartItems;

    return result;
}