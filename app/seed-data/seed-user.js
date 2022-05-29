import faker from "faker";
import { getCSVFiles, getContentCSVFiles, cleanField } from "./scanDataFile";
import { Users } from "../models/user";
import { createStripeAccount } from "../api/client/payment/stripe.service";

const Promise = require("bluebird");

faker.locale = "vi";

export const generateUser = async () => {
  try {
    const dataFile = await getCSVFiles("users");

    const { header, content } = await getContentCSVFiles(dataFile[0], ";");

    let dataSeed = [];

    let index = 0;

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(";"));
      let isExisted = false
      try {
        isExisted = await Users.findOne({
          where: {
            _id: field[header.indexOf("_id")]
          }
        })
      } catch (err) {
        isExisted = false;
      }

      index++;

      const item = {
        _id: field[header.indexOf("_id")],
        username: field[header.indexOf("username")],
        fullName: field[header.indexOf("fullName")],
        email: field[header.indexOf("email")],
        role: field[header.indexOf("role")],
        publicKey: "ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM",
        encryptedPrivateKey:
          "U2FsdGVkX1849aMg8O6GLRVrFSLd2aQI4cRaS4Ql2nZr8p+smv5O9koFn+J6EkcwaZF6u8dGb3tJEXg35q0raA==",
        isBanned: false,
        age: 18,
        phoneNumber: `098898888${index}1`,
      };

      if (isExisted) return;

      const stripeAccount = await createStripeAccount({
        email: item.email,
        metatdata: item,
      });

      const finalItem = { ...item, stripeAccount: stripeAccount?.id || null };

      dataSeed.push(finalItem);
    });

    await Users.sync({ force: false })
      .then(() => {
        return Users.bulkCreate(dataSeed);
      })
      .catch((err) => console.log({ userSeedErr: err }));

    return dataSeed;
  } catch (err) {
    throw new Error(err.message);
  }
};
