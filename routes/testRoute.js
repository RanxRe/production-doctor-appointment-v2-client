const express = require("express");
const { getTestController } = require("../controllers/getTestController");

// router object
const router = express.Router();

//routes
router.get("/test", getTestController);

module.exports = router;
