const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Azure_Account = sequelize.define(
  "Azure_Account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientSecret: {
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

module.exports = Azure_Account;
