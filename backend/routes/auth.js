const router = require("express").Router();
const controller = require("../controllers/auth");
router.post("/signup", controller.register);
router.post("/signin", controller.authenticate);

module.exports = router;
