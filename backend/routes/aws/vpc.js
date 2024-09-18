const router = require("express").Router();
const controller = require("../../controllers/aws/vpc.js");

router.route("/").get(controller.get_vpcs_and_subnets);
router.route("/sgs").get(controller.list_security_groups).post(controller.create_security_group);
router.route("/sgs/ingress").post(controller.create_ingress_rule);
router.route("/sgs/egress").post(controller.create_egress_rule);