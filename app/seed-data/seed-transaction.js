import faker from "faker";
import { getCSVFiles, getContentCSVFiles, cleanField } from "./scanDataFile";
import { Transactions } from "../models/transaction";

const Promise = require("bluebird");

faker.locale = "vi";

export const generateTransaction = async () => {
  try {
    // const dataFile = await getCSVFiles("transactions");

    // const { header, content } = await getContentCSVFiles(dataFile[0], ";");

    // let dataSeed = [];

    // await Promise.each(content, async (line) => {
    //   const field = cleanField(line.split(";"));
    //   const userId = field[header.indexOf("userId")],
    //   const item = {
    //     transactionId: field[header.indexOf("transactionId")],
    //     userId: userId,
    //     paymentCard: "",
    //     items: field[header.indexOf("items")],
    //   };
    //   dataSeed.push(item);
    // });

    // await Transactions.sync({ force: false })
    //   .then(() => {
    //     return Transactions.bulkCreate(dataSeed);
    //   })
    //   .catch((err) => console.log({ transactionSeedErr: err }));

    // return dataSeed;

    await Transactions.sync();
  } catch (err) {
    throw new Error(err.message);
  }
};
