const router = require("express").Router();
const controller = require("../../controllers/aws/ec2.js");

router
  .route("/")
  .post(controller.create)
  .delete(controller.terminate)
  .get(controller.list);

router.route("/keypair").post(controller.create_key_pair);
router.route("/vpcs").get(controller.get_vpcs_and_subnets);
router.route("/sgs").get(controller.list_security_groups).post(controller.create_security_group);

module.exports = router;
