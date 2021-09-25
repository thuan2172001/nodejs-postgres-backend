import { Users } from "../../../models/user";
import { Carts } from "../../../models/cart";
import { Episodes } from "../../../models/episode";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { createStripeAccount } from "../payment/stripe.service";
import { removeEmptyValueObject } from "../../../utils/validate-utils";

const { DataTypes } = require('sequelize');
const uuidv1 = require('uuidv1');

export const getCartData = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const cart = await Carts.findOne({ where: { userId } });

    if (!cart) return []

    const episodesId = cart.dataValues?.cartItems ?? [];

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

    if (!cart) return []

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

export const getBookshelfData = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const bookshelf = await Bookshelves.findOne({ where: { userId } });

    if (!bookshelf) return []

    const episodesId = bookshelf.dataValues?.bookshelfItems ?? [];

    let result = [];

    await Promise.all(episodesId.map(async (episodeId) => {
        const episodeData = await Episodes.findOne({ where: { episodeId } })
        result.push(episodeData.dataValues)
    }))

    return result;
}

export const getBookshelf = async ({ userId }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const bookshelf = await Bookshelves.findOne({ where: { userId } });

    if (!bookshelf) return []

    const episodesId = bookshelf.dataValues?.bookshelfItems || [];

    return episodesId;
}

export const updateBookshelf = async ({ userId, bookshelfItems }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const bookshelf = await Bookshelves.findOne({ where: { userId } });

    if (!bookshelf) {
        const newBookshelf = await Bookshelves.create({
            userId,
            bookshelfItems,
        })
        return newBookshelf;
    }

    const result = await Bookshelves.update({ bookshelfItems: bookshelfItems }, { where: { userId: userId } })

    return result;
}


export const editUser = async ({ userId, fullName, age, phoneNumber }) => {
    const user = await Users.findOne({ where: { _id: userId } });

    if (!user) throw new Error('USER.USER_NOT_FOUND');

    const data = removeEmptyValueObject({ fullName, age, phoneNumber })

    const result = await Users.update({ ...data }, { where: { _id: userId } })

    return result;
}

export const createUser = async ({ username, email, fullName, publicKey, encryptedPrivateKey, phoneNumber, age }) => {

    if (!username || !email || !fullName || !publicKey || !encryptedPrivateKey || !phoneNumber || !age) {
        throw new Error('USER.CREATE_USER.MISSING_FIELD')
    }

    const checkUsername = await Users.findOne({ where: { username } });

    console.log({ checkUsername })

    if (checkUsername) throw new Error('USER.CREATE_USER.EXISTED_USERNAME')

    const checkEmail = await Users.findOne({ where: { email } });

    if (checkEmail) throw new Error('USER.CREATE_USER.EXISTED_EMAIL')

    const item = {
        _id: uuidv1(),
        username,
        email,
        fullName,
        publicKey,
        encryptedPrivateKey,
        phoneNumber,
        age,
        role: 'user',
        isBanned: false
    }

    const stripeAccount = await createStripeAccount({
        email: item.email,
        metatdata: item,
    })

    const result = await Users.create({
        ...item,
        stripeAccount: stripeAccount.id
    })

    return result;
}

export const editUserStatus = async ({ authId, username, type }) => {
    const creator = await Creators.findOne({ where: { _id: authId } });

    if (!creator) throw new Error('USER.EDIT_STATUS.NOT_HAVE_PERMISSION');

    if (!username) throw new Error('USER.EDIT_STATUS.USERNAME_IS_REQUIRED');

    const user = await Users.findOne({ where: { username: username } });

    if (!user) throw new Error('USER.EDIT_STATUS.USER_NOT_FOUND');

    if (type !== 'BAN_USER' && type != 'UNBAN_USER') throw new Error('USER.EDIT_STATUS.INVALID_TYPE');

    const isBanned = type === 'BAN_USER' ? true : false;

    const result = await Users.update({ isBanned }, { where: { username } })
    return result;
}