const express = require("express");
const router = express.Router();
const testController = require("../controller/test.controller");
const { verifyToken } = require("../middleware/verify_token");

router.get("/", verifyToken, testController.getUser);

module.exports = router;
