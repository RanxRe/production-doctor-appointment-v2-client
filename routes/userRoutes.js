const express = require("express");
const {
  userRegister,
  userLogin,
  updateUser,
  resetPassword,
  getAllUser,
  getUserDetail,
  getStats,
  getLoginUser,
} = require("../controllers/userController");
const { userAuth, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/mutler");

const router = express.Router();

//register || post
router.post("/register", userRegister);

//login || post
router.post("/login", userLogin);

//update profile || patch            2 - Middlewares:      <image name>
router.patch("/update/:id", userAuth, upload.single("image"), updateUser);

//update password || patch
router.patch("/update-password/:id", userAuth, resetPassword);

//get all user || get
router.get("/get-all-user", userAuth, isAdmin, getAllUser);

//get login user detail || get
router.get("/get-login-user/:id", userAuth, getLoginUser);

//get all stats || get
router.get("/get-stats", userAuth, isAdmin, getStats);

//get all user and appointment detail || get
router.get("/get-all-user/:id", userAuth, isAdmin, getUserDetail);

module.exports = router;
