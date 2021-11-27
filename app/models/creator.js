import { Sql } from "../database";

const { DataTypes } = require("sequelize");

const Creators = Sql.define(
  "creators",
  {
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    publicKey: {
      type: DataTypes.STRING,
    },
    encryptedPrivateKey: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        "https://raw.githubusercontent.com/thuan2172001/HarryPotterSeries/main/gray.png",
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue:
        "Hắn vừa đi vừa chửi. Bao giờ cũng thế, cứ rượu xong là hắn chửi. Bắt đầu chửi trời, có hề gì? Trời có của riêng nhà nào? Rồi hắn chửi đời. Thế cũng chẳng sao: Đời là tất cả nhưng cũng chẳng là ai. Tức mình hắn chửi ngay tất cả làng Vũ Đại. Nhưng cả làng Vũ Đại ai cũng nhủ: “Chắc nó trừ mình ra!”. Không ai lên tiếng cả. Tức thật! Ồ thế này thì tức thật! Tức chết đi được mất! Đã thế, hắn phải chửi cha đứa nào không chửi nhau với hắn. Nhưng cũng không ai ra điều. Mẹ kiếp! Thế thì có phí rượu không? Thế thì có khổ hắn không? Không biết đứa chết mẹ nào đẻ ra thân hắn cho hắn khổ đến nông nỗi này! A ha! Phải đấy hắn cứ thế mà chửi, hắn chửi đứa chết mẹ nào đẻ ra thân hắn, đẻ ra cái thằng Chí Phèo? Mà có trời biết! Hắn không biết, cả làng Vũ Đại cũng không ai biết.",
    },
    sns: {
        type: DataTypes.STRING,
        defaultValue: "https://twitter.com/elonmusk"
    },
    mediaLinks: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
  }
);

module.exports.Creators = Creators;
