const router = require("express").Router();
const attachAWS = require("../middleware/aws.js");
router.use("/auth", require("./aws/cred"));
router.use(attachAWS);
router.use("/instances", require("./aws/ec2"));
router.use("/vpcs", require("./aws/vpc"));

module.exports = router;
