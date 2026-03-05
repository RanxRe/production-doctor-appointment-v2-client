const doctorModel = require("../models/doctorModel");

//add doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      degree,
      fee,
      about,
      gender,
      phone,
      address,
      image,
      speciality,
      experience,
      dob,
    } = req.body;
    if (
      !name ||
      !email ||
      !degree ||
      !fee ||
      !about ||
      !gender ||
      !phone ||
      !address ||
      !speciality ||
      !experience ||
      !dob
    ) {
      return res.status(401).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const imageToBuffer64 = req.file && req.file.buffer.toString("base64");
    const doctorData = {
      name,
      email,
      degree,
      fee,
      about,
      gender,
      phone,
      address,
      image: imageToBuffer64,
      speciality,
      experience,
      dob,
    };

    const doctor = await new doctorModel(doctorData);
    await doctor.save();
    res.status(201).send({
      success: true,
      message: "Doctor created",
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in add doctor API",
    });
  }
};

//get all doctors
const getAllDoctor = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find()
      .select("image name available speciality degree experience fee phone email");
    res.status(200).send({
      success: true,
      message: "All Doctors fetched",
      totalCount: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all doctor API",
      error,
    });
  }
};

//get single doctor
const getDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Add doctor id",
      });
    }
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor details not found with this id",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor details fetched",
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doctor details API",
      error,
    });
  }
};

// update doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please add docto id",
      });
    }
    const data = req.body;

    // If new image uploaded
    if (req.file) {
      data.image = req.file.buffer.toString("base64");
    }
    // const imageToBuffer64 = req.file && req.file.buffer.toString("base64");
    const doctor = await doctorModel.findByIdAndUpdate(
      id,
      { $set: data },
      // { returnOriginal: false },
      { new: true },
    );
    res.status(200).send({
      success: true,
      message: "Doctor updated",
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update docto API",
      error,
    });
  }
};

//delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "provide doctor id",
      });
    }
    const doctor = await doctorModel.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor deleted",
      deletedDoctorId: doctor.id,
      deletedDoctorName: doctor.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      sucess: false,
      message: "Error in delete doctor API",
      error,
    });
  }
};

//update doctor available status
const updateAvailableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "id not found",
      });
    }
    const { availableStatus } = req.body;
    if (availableStatus === undefined) {
      return res.status(404).send({
        success: false,
        message: "available status not found",
      });
    }
    const doctor = await doctorModel.findByIdAndUpdate(
      id,
      { $set: { available: availableStatus } },
      { returnOriginal: false },
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor available status updated",
      doctorId: doctor.id,
      updatedStatus: doctor.available,
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update available status API",
      error,
    });
  }
};
module.exports = {
  addDoctor,
  getAllDoctor,
  getDoctorDetails,
  updateDoctor,
  deleteDoctor,
  updateAvailableStatus,
};
