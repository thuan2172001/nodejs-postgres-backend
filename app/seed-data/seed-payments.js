import faker from "faker";
import { getCSVFiles, getContentCSVFiles, cleanField } from "./scanDataFile";
import { PaymentMethods } from "../models/payment_method";

const Promise = require("bluebird");

faker.locale = "vi";

export const generatePayment = async () => {
  try {
    await PaymentMethods.sync();
  } catch (err) {
    throw new Error(err.message);
  }
};
