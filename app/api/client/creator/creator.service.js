import { Promise } from "bluebird";
import { Creators } from "../../../models/creator";
import { Transactions } from "../../../models/transaction";
import { QueryTypes } from "sequelize";
import { Sql } from "../../../database";

export const getSalesData = async ({ creatorId }) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  const months = Array.from(Array(12).keys());

  if (!creator) throw new Error("CREATOR.CREATOR_NOT_FOUND");

  const transactions = await Transactions.findAll({});
  let monthSales = [];

  await Promise.each(months, async (month) => {
    const monthTransactions = await Sql.query(
      `SELECT * FROM transactions where extract(month from "bought_at") = ${
        month + 1
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

export const exportTransaction = async ({ creatorId }) => {
  const creator = await Creators.findOne({ where: { _id: creatorId } });

  // const months = Array.from(Array(12).keys());

  if (!creator) throw new Error("CREATOR.CREATOR_NOT_FOUND");

  // let data = [];

  const allTransactions = await Transactions.findAll();

  return allTransactions

  // await Promise.each(months, async (month) => {
  //   const monthTransactions = await Sql.query(
  //     `SELECT * FROM transactions where extract(month from "bought_at") = ${
  //       month + 1
  //     }`,
  //     {
  //       type: QueryTypes.SELECT,
  //     }
  //   );
  //   data.push(monthTransactions);
  // });

  // return { data };
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

  console.log({mediaLinks});

  const status = await creator.update({
    fullName: shopName,
    avatar: avatar,
    description: description,
    sns: sns,
    mediaLinks: mediaLinks,
  });

  return status;
};

