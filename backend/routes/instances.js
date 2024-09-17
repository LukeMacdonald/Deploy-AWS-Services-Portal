const express = require("express");
const router = express.Router();
const controller = require("../controllers/instances.js");

router.get("/instances/all", controller.list);
router.post("/instance/terminate", controller.terminate);
module.exports = router;
