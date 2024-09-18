const { findAWSAccountByID } = require("../database/queries/aws");
const AWS = require("aws-sdk");

const attachAWS = (req, res, next) => {
  const account = findAWSAccountByID(req.user.id);
  AWS.config.update({
    accessKeyId: account.keyId,
    secretAccessKey: account.accessKey,
    region: req.body.region,
  });
  req.aws = AWS;
  next();
};

module.exports = attachAWS;
