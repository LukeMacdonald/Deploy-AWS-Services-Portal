const AWS = require("aws-sdk");

const attachAWS = (req, res, next) => {
  AWS.config.update({
    accessKeyId: req.user.keyId,
    secretAccessKey: req.user.accessKey,
    region: req.body.region,
  });
  req.aws = AWS;
  next();
};

module.exports = attachAWS;
