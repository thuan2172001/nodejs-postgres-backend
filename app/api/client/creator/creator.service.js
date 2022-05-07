import { Promise } from "bluebird";
import { Creators } from "../../../models/creator";
import { Users } from "../../../models/user";
import { Episodes } from "../../../models/episode";
import { Series } from "../../../models/serie";
import { Transactions } from "../../../models/transaction";
import { QueryTypes } from "sequelize";
import { Sql } from "../../../database";
import { createStripeAccount } from "../payment/stripe.service";

const uuidv1 = require("uuidv1");

export const createCreator = async ({
  username,
  email,
  fullName,
  publicKey,
  encryptedPrivateKey,
  phoneNumber,
  avatar,
  description
}) => {
  if (!username || !email || !fullName || !publicKey || !encryptedPrivateKey) {
    throw new Error("CREATOR.CREATE_CREATOR.MISSING_FIELD");
  }

  const checkUsernameCreator = await Creators.findOne({ where: { username } });
  const checkUsernameUser = await Users.findOne({ where: { username } });

  if (checkUsernameCreator || checkUsernameUser) throw new Error("CREATOR.CREATE_ACCOUNT.EXISTED_USERNAME");

  const checkEmailCreator = await Creators.findOne({ where: { email } });
  const checkEmailUser = await Users.findOne({ where: { email } });

  if (checkEmailCreator || checkEmailUser) throw new Error("CREATOR.CREATE_ACCOUNT.EXISTED_EMAIL");

  const item = {
    _id: uuidv1(),
    username,
    email,
    fullName,
    publicKey,
    encryptedPrivateKey,
    phoneNumber,
    role: "creator",
    avatar: avatar ?? "https://raw.githubusercontent.com/thuan2172001/HarryPotterSeries/main/gray.png",
    description: description ?? "Hắn vừa đi vừa chửi. Bao giờ cũng thế, cứ rượu xong là hắn chửi. Bắt đầu chửi trời, có hề gì? Trời có của riêng nhà nào? Rồi hắn chửi đời. Thế cũng chẳng sao: Đời là tất cả nhưng cũng chẳng là ai. Tức mình hắn chửi ngay tất cả làng Vũ Đại. Nhưng cả làng Vũ Đại ai cũng nhủ: “Chắc nó trừ mình ra!”. Không ai lên tiếng cả. Tức thật! Ồ thế này thì tức thật! Tức chết đi được mất! Đã thế, hắn phải chửi cha đứa nào không chửi nhau với hắn. Nhưng cũng không ai ra điều. Mẹ kiếp! Thế thì có phí rượu không? Thế thì có khổ hắn không? Không biết đứa chết mẹ nào đẻ ra thân hắn cho hắn khổ đến nông nỗi này! A ha! Phải đấy hắn cứ thế mà chửi, hắn chửi đứa chết mẹ nào đẻ ra thân hắn, đẻ ra cái thằng Chí Phèo? Mà có trời biết! Hắn không biết, cả làng Vũ Đại cũng không ai biết.",
    isBanned: false,
  };

  const stripeAccount = await createStripeAccount({
    email: item.email,
    metatdata: item,
  });

  const result = await Creators.create({
    ...item,
    stripeAccount: stripeAccount.id,
  });

  return result;
};

export const getCreatorInfo = async ({
  creatorId,
}) => {
  let creator = await Creators.findOne({
    where: {
      _id: creatorId,
    },
    attributes: ["_id", "fullName", "avatar", "description", "sns", "mediaLinks", "createdAt"]
  })

  if (!creator) throw new Error("CREATOR.CREATOR_NOT_FOUND");

  let series = await Series.findAll({
    where: {
      creatorId
    },
    attributes: ["serieId"]
  })

  let seriesIds = series.map((serie) => serie.dataValues.serieId)

  let episodes = await Episodes.findAll({
    where: {
      serieId: seriesIds
    },
    attributes: ["episodeId"]
  })

  return {
    creator, seriesQuantity: series.length, episodeQuantity: episodes.length, 
  }
}

export const getAll = async ({
  page = 1,
  limit = 100,
  pattern = null,
}) => {
  let creator = await Creators.findAndCountAll({
    offset: (page - 1) * limit,
    limit: limit,
    order: [["_id", "desc"]],
    attributes: ["_id", "fullName", "avatar", "description", "email"]
  })

  let formatedData = await Promise.all(creator.rows.map(async (item) => {
    let seriesData = await Series.findAll({
      where: {
        creatorId: item._id
      },
      attributes: ["serieId"]
    })

    return {
      ...item.dataValues,
      seriesQuantity: seriesData.length,
    }
  }))


  return {
    total: creator.count,
    creators: formatedData
  }
}

export const getSalesData = async ({ creatorId }) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  const months = Array.from(Array(12).keys());

  if (!creator) throw new Error("CREATOR.CREATOR_NOT_FOUND");

  const transactions = await Transactions.findAll({});
  let monthSales = [];

  await Promise.each(months, async (month) => {
    const monthTransactions = await Sql.query(
      `SELECT * FROM transactions where extract(month from "bought_at") = ${month + 1
      }`,
      {
        type: QueryTypes.SELECT,
      }
    );
    const monthSale = monthTransactions.reduce((prv, cur) => {
      return prv + cur.value;
    }, 0);
    monthSales.push(monthSale);
  });

  let total = 0;

  transactions.forEach((transaction) => {
    total += transaction.value;
  });

  return { total, monthSales };
};

export const editInfo = async ({
  creatorId,
  shopName,
  avatar,
  description,
  sns,
  mediaLinks,
}) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  if (!creator) throw new Error("CREATOR.CREATOR_NOT_FOUND");

  console.log({ mediaLinks });

  const status = await creator.update({
    fullName: shopName,
    avatar: avatar,
    description: description,
    sns: sns,
    mediaLinks: mediaLinks,
  });

  return status;
};
