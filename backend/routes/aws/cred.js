const router = require("express").Router();
const controller = require("../../controllers/aws/credentials");
router.post("/", controller.create);
module.exports = router;
