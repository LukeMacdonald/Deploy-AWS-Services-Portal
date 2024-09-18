const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const AWS_Account = sequelize.define(
  "AWS_Account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accessKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true, // Ensure that each userId is unique
      allowNull: false,
      references: {
        model: "Users", // The name of the User model
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  },
);

module.exports = AWS_Account;
