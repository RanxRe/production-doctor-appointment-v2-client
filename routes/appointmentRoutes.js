const express = require("express");
const {
  createAppointment,
  getAllappointment,
  getAppointmentDetail,
  updateAppointmentStatus,
  getUserAppointment,
  getUserAppointmentDetail,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { userAuth, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

//create appointment || post
router.post("/create", userAuth, createAppointment);

//get all appointment || get
router.get("/get-all-appointment", userAuth, isAdmin, getAllappointment);

//get appointment detail || get
router.get("/get-appointment/:id", userAuth, isAdmin, getAppointmentDetail);

//update appointment status || patch
router.patch("/update-appointment-status/:id", userAuth, isAdmin, updateAppointmentStatus);

//get user appointment || get
router.get("/get-user-appointment/:id", userAuth, getUserAppointment);

//get user appointment detail || get
router.get("/get-user-appointment-detail/:id", userAuth, getUserAppointmentDetail);

//cancel user appointment || post
router.post("/cancel/:id", userAuth, cancelAppointment);

module.exports = router;
