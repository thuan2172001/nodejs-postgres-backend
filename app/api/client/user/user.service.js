import { Users } from "../../../models/user";
import { Likes } from "../../../models/like";
import { Carts } from "../../../models/cart";
import { Episodes } from "../../../models/episode";
import { Series } from "../../../models/serie";
import { Transactions } from "../../../models/transaction";
import { PaymentMethods } from "../../../models/payment_method";
import { Bookshelves } from "../../../models/bookshelf";
import { Creators } from "../../../models/creator";
import { createStripeAccount } from "../payment/stripe.service";
import { removeEmptyValueObject } from "../../../utils/validate-utils";
import { getPagination } from "../../../utils/pagination";
import { Op } from "sequelize";

const { DataTypes } = require("sequelize");
const uuidv1 = require("uuidv1");

export const getAllUser = async ({ creatorId, page = 1, limit = 1000 }) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  if (!creator) throw new Error("USER.GET_ALL.CREATOR_NOT_FOUND");

  const userList = await Users.findAll({ order: [["username", "ASC"]] });

  const dataFormatter = userList.map((user) => {
    const dataValues = user.dataValues;
    return {
      _id: dataValues._id,
      username: dataValues.username,
      email: dataValues.email,
      fullName: dataValues.fullName,
      phoneNumber: dataValues.phoneNumber,
      age: dataValues.age,
      isBanned: dataValues.isBanned,
    };
  });

  return {
    data: getPagination({ array: dataFormatter, page, limit }),
    total: dataFormatter.length,
  };
};

export const findUsersByPattern = async ({
  creatorId,
  page = 1,
  limit = 100,
  pattern = "",
}) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  if (!creator) throw new Error("USER.GET_ALL.CREATOR_NOT_FOUND");

  const userList = await Users.findAll({
    where: {
      username: {
        [Op.like]: `%${pattern}%`,
      },
    },
    order: [["username", "ASC"]],
  });

  console.log({ userList });

  return {
    data: getPagination({ array: userList, page, limit }),
    total: dataFormatter.length,
  };
};

export const getCartData = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const cart = await Carts.findOne({ where: { userId } });

  if (!cart) return [];

  const episodesId = cart.dataValues?.cartItems ?? [];

  let result = [];

  await Promise.all(
    episodesId.map(async (episodeId) => {
      const episodeData = await Episodes.findOne({ where: { episodeId } });
      episodeData && result.push(episodeData.dataValues);
    })
  );

  return result;
};

export const getCart = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const cart = await Carts.findOne({ where: { userId } });

  if (!cart) return [];

  const episodesId = cart.dataValues?.cartItems || [];

  return episodesId;
};

export const updateCart = async ({ userId, cartItems }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const cart = await Carts.findOne({ where: { userId } });

  if (!cart) {
    const newCart = await Carts.create({
      cartId: uuidv1(),
      userId,
      cartItems,
    });
    return newCart;
  }

  const result = await Carts.update(
    { cartItems: cartItems },
    { where: { userId: userId } }
  );

  return result;
};

export const getBookshelfData = async ({ userId, page = 1, limit = 1000, pattern = null }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const bookshelf = await Bookshelves.findOne({ where: { userId } });

  if (!bookshelf) return [];

  const episodesId = bookshelf.dataValues?.bookshelfItems ?? [];

  let result = [];

  await Promise.all(
    episodesId.map(async (episodeId) => {
      if (episodeId) {
        const episodeData = await Episodes.findOne({ where: { episodeId } });
        const likes = await Likes.findAll({ where: { episodeId } });
        const alreadyLiked = await Likes.findOne({
          where: { episodeId, userId },
        });
        const episodeDataValue = episodeData.dataValues;
        if (pattern) {
          const episodeName = episodeDataValue.name;
          if (episodeName.toLowerCase().includes(pattern.toLowerCase())) {
            result.push({
              ...episodeDataValue,
              totalLikes: episodeData.likeInit + likes.length,
              alreadyLiked: alreadyLiked !== null,
            });
          }
        } else {
          result.push({
            ...episodeDataValue,
            totalLikes: episodeData.likeInit + likes.length,
            alreadyLiked: alreadyLiked !== null,
          });
        }
      }
    })
  );

  return {
    data: getPagination({ array: result, page, limit }),
    totalEpisodes: result.length,
  };
};

export const getFavoriteEpisodes = async ({
  userId,
  type = "EPISODE",
  page,
  limit,
  pattern = null,
}) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  let result = [];

  if (type === "EPISODE") {
    const likes =
      (await Likes.findAll({ where: { userId, serieId: null } })) || [];

    await Promise.all(
      likes.map(async (like) => {
        const episodeId = like.episodeId;
        const episodeData = await Episodes.findOne({ where: { episodeId } });
        const likes = await Likes.findAll({ where: { episodeId } });
        const episodeDataValue = episodeData.dataValues;
        if (pattern) {
          const episodeName = episodeDataValue.name;
          if (episodeName.toLowerCase().includes(pattern.toLowerCase())) {
            result.push({
              ...episodeDataValue,
              totalLikes: episodeData.likeInit + likes.length,
              alreadyLiked: true,
            });
          }
        } else {
          result.push({
            ...episodeDataValue,
            totalLikes: episodeData.likeInit + likes.length,
            alreadyLiked: true,
          });
        }
      })
    );
  } else if (type == "SERIES") {
    const likes =
      (await Likes.findAll({ where: { userId, episodeId: null } })) || [];

    await Promise.all(
      likes.map(async (like) => {
        const serieId = like.serieId;
        const serieData = await Series.findOne({ where: { serieId } });
        const likes = await Likes.findAll({ where: { serieId } });
        const serieDataValue = serieData.dataValues;
        if (pattern) {
          const seriesName = serieDataValue.serieName;
          if (seriesName.toLowerCase().includes(pattern.toLowerCase())) {
            result.push({
              ...serieDataValue,
              totalLikes: 1000 + likes.length,
              alreadyLiked: true,
            });
          }
        } else {
          result.push({
            ...serieDataValue,
            totalLikes: 1000 + likes.length,
            alreadyLiked: true,
          });
        }
        
      })
    );
  } else {
    throw new Error("USER.GET_FAVORITE.INVALID_TYPE");
  }

  return {
    data: getPagination({ array: result, page, limit }),
    totalEpisodes: result.length,
  };
};

export const getBookshelf = async ({ userId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const bookshelf = await Bookshelves.findOne({ where: { userId } });

  if (!bookshelf) return [];

  const episodesId = bookshelf.dataValues?.bookshelfItems || [];

  const epiosodeIdList = episodesId.filter((e) => e !== null);

  return epiosodeIdList;
};

export const updateBookshelf = async ({ userId, episodeId }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const episode = await Episodes.findOne({ where: { episodeId } });

  if (!episode) throw new Error("ADD_TO_BOOKSHELF.EPISODE_NOT_FOUND");

  const isFree = episode?.dataValues?.price <= 0;

  if (!isFree) throw new Error("ADD_TO_BOOKSHELF.EPISODE_NOT_FREE");

  const bookshelf = await Bookshelves.findOne({ where: { userId } });

  if (!bookshelf) {
    const newBookshelf = await Bookshelves.create({
      userId,
      bookshelfItems: [episodeId],
    });
    return newBookshelf;
  }

  const bookshelfItems = bookshelf?.dataValues?.bookshelfItems || [];

  const alreadyExisted = bookshelfItems.includes(episodeId);

  if (alreadyExisted) return true;

  const newBookshelfItems =
    bookshelfItems.length > 0 ? [...bookshelfItems, episodeId] : [episodeId];

  const result = await Bookshelves.update(
    { bookshelfItems: newBookshelfItems },
    { where: { userId: userId } }
  );

  return result;
};

export const editUser = async ({ userId, fullName, age, phoneNumber }) => {
  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.USER_NOT_FOUND");

  const data = removeEmptyValueObject({ fullName, age, phoneNumber });

  const result = await Users.update({ ...data }, { where: { _id: userId } });

  return result;
};

export const createUser = async ({
  username,
  email,
  fullName,
  publicKey,
  encryptedPrivateKey,
  phoneNumber,
  age,
}) => {
  if (!username || !email || !fullName || !publicKey || !encryptedPrivateKey) {
    throw new Error("USER.CREATE_USER.MISSING_FIELD");
  }

  const checkUsername = await Users.findOne({ where: { username } });

  if (checkUsername) throw new Error("USER.CREATE_USER.EXISTED_USERNAME");

  const checkEmail = await Users.findOne({ where: { email } });

  if (checkEmail) throw new Error("USER.CREATE_USER.EXISTED_EMAIL");

  const item = {
    _id: uuidv1(),
    username,
    email,
    fullName,
    publicKey,
    encryptedPrivateKey,
    phoneNumber,
    age,
    role: "user",
    isBanned: false,
  };

  const stripeAccount = await createStripeAccount({
    email: item.email,
    metatdata: item,
  });

  const result = await Users.create({
    ...item,
    stripeAccount: stripeAccount.id,
  });

  if (result) {
    const createBookshelf = await Bookshelves.create({
      userId: item._id,
      bookshelfItems: [],
    });
    console.log({ createBookshelf });
  }

  return result;
};

export const editUserStatus = async ({ authId, userId, type }) => {
  const creator = await Creators.findOne({ where: { _id: authId } });

  if (!creator) throw new Error("USER.EDIT_STATUS.NOT_HAVE_PERMISSION");

  if (!userId) throw new Error("USER.EDIT_STATUS.USERID_IS_REQUIRED");

  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.EDIT_STATUS.USER_NOT_FOUND");

  if (type !== "BAN_USER" && type != "UNBAN_USER")
    throw new Error("USER.EDIT_STATUS.INVALID_TYPE");

  const isBanned = type === "BAN_USER" ? true : false;

  const result = await Users.update({ isBanned }, { where: { _id: userId } });
  return result;
};

export const getAllTransaction = async ({ authId, userId , page = 1, limit = 1000 }) => {
  const creator = await Creators.findOne({ where: { _id: authId } });

  if (!userId) throw new Error("USER.TRANSACTION.USERID_IS_REQUIRED");

  const user = await Users.findOne({ where: { _id: userId } });

  if (!user) throw new Error("USER.TRANSACTION.USER_NOT_FOUND");

  if (!creator && authId !== userId)
    throw new Error("USER.TRANSACTION.DONT_HAVE_PERMISSION");

  const transactions = await Transactions.findAll({
    userId,
  });

  const data = await Promise.all(
    transactions.map(async ({ transactionId, paymentId, value, items }) => {
      const payment = await PaymentMethods.findOne({
        where: { paymentId },
      });

      if(!payment) return null;
      return {
        transactionId,
        payment: payment.card,
        value,
        items,
      };
    })
  );

  const result = data.filter(ele => ele !== null);

  return {
    data: getPagination({ array: result, page, limit }),
    total: result.length,
  };
};
