const { AWS_Account } = require("../associations");

const findAWSAccountByID = async (userId) => {
  try {
    const account = await AWS_Account.findOne({ where: { userId } });
    return account;
  } catch (error) {
    throw new Error("Database query failed");
  }
};

module.exports = {
  findAWSAccountByID,
};
