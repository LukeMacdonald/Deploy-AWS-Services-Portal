const express = require("express");
const router = express.Router();
const controller = require("../controllers/instances.js");

router.get("/instances/all", controller.list);

module.exports = router;
