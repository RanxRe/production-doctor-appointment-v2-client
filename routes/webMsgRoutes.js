const express = require("express");
const { createWebMsg, getAllWebMsg, deleteWebMsg } = require("../controllers/webMessageController");
const { isAdmin, userAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

//create message || post
router.post("/create", createWebMsg);

//get all message || get
router.get("/get-message", userAuth, isAdmin, getAllWebMsg);

//delete web message || delete
router.delete("/delete-message/:id", userAuth, isAdmin, deleteWebMsg);

module.exports = router;
