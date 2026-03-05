const express = require("express");
const {
  addDoctor,
  getAllDoctor,
  getDoctorDetails,
  updateDoctor,
  deleteDoctor,
  updateAvailableStatus,
} = require("../controllers/doctorController");
const { userAuth, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/mutler");

const router = express.Router();

//doctor create || post
router.post("/create", userAuth, isAdmin, upload.single("image"), addDoctor);

//get all doctor || get
router.get("/get-all", getAllDoctor);

//get doctor detail || get
router.get("/get-doctor-detail/:id", getDoctorDetails);

//doctor update || patch
router.patch("/update-doctor/:id", userAuth, isAdmin, upload.single("image"), updateDoctor);

//doctor status update || patch
router.patch("/update-doctor-status/:id", userAuth, isAdmin, updateAvailableStatus);

//doctor delete || delete
router.delete("/delete-doctor/:id", userAuth, isAdmin, deleteDoctor);
module.exports = router;
