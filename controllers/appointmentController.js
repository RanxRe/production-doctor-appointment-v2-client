const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");

//create appointment
const createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, slotDate, slotTime, amount } = req.body;
    if (!userId || !doctorId || !slotDate || !slotTime || !amount) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    //appointmet gets created when these fields are provided by req.body
    const appointment = new appointmentModel({ userId, doctorId, slotDate, slotTime, amount });
    await appointment.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in apointment create API",
    });
  }
};

//get all appointment
const getAllappointment = async (req, res) => {
  try {
    const appointment = await appointmentModel
      .find()
      .select("_id slotDate slotTime amount status")
      .populate("userId", "name email");
    if (!appointment) {
      return res.status(404).send({
        succeess: false,
        message: "No appointment found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All appointments fetched",
      totalCount: appointment.length,
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all appointment API",
    });
  }
};

//get detailed apointment
const getAppointmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide id",
      });
    }
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No appointment found with this id",
      });
    }
    //find doctor and user with id available in appointmentModel userId & doctorId
    const user = await userModel.findOne({ _id: appointment?.userId });
    const doctor = await doctorModel.findOne({ _id: appointment?.doctorId });

    res.status(200).send({
      success: true,
      message: "Appointment detail fetched",
      appointmentDetails: {
        clientName: user?.name,
        clientPhone: user?.phone,
        clientEmail: user?.email,
        doctorName: doctor?.name,
        doctorPhone: doctor?.phone,
        doctorEmail: doctor?.email,
        bookingDate: appointment?.slotDate,
        bookingTime: appointment?.slotTime,
        bookingAmount: appointment?.amount,
        bookingStatus: appointment?.status,
        bookingPayment: appointment?.payment,
        createdAt: appointment?.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get appointment detail API",
      error,
    });
  }
};

//update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "please provide appointment id",
      });
    }

    const { appointmentStatus } = req.body;
    if (!appointmentStatus) {
      return res.status(404).send({
        success: false,
        message: "Please provide appointment status",
      });
    }
    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      { $set: { status: appointmentStatus } },
      { returnOriginal: false },
    );
    res.status(200).send({
      success: true,
      message: "Appointment status updated",
      updatedStatusTo: appointment.status,
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update appointment status API",
    });
  }
};

//get user appointment
const getUserAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide appointment id",
      });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No user found",
      });
    }

    //here using populate because we want to doctor & user details from its dcotorId & userId.
    const appointments = await appointmentModel
      .find({ userId: user?.id })
      .populate("doctorId", "name ")
      .populate("userId", "name phone");
    res.status(200).send({
      success: true,
      message: "Appointments fetched",
      totalCount: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get user appointment API",
    });
  }
};

//get user appointment detail
const getUserAppointmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide id",
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No user found with this id",
      });
    }
    //find doctor and appointment with id available in appointmentModel userId & doctorId
    const appointment = await appointmentModel.findOne({ userId: user?._id });
    const doctor = await doctorModel.findOne({ _id: appointment?.doctorId });

    res.status(200).send({
      success: true,
      message: "Appointment detail fetched",
      appointmentDetails: {
        doctorName: doctor?.name,
        doctorPhone: doctor?.phone,
        doctorEmail: doctor?.email,
        bookingDate: appointment?.slotDate,
        bookingTime: appointment?.slotTime,
        bookingAmount: appointment?.amount,
        bookingStatus: appointment?.status,
        bookingPayment: appointment?.payment,
        createdAt: appointment?.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get appointment detail API",
      error,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide id",
      });
    }
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found with this id",
      });
    }
    // await appointmentModel.updateOne({ $set: { status: "cancel" } });
    appointment.status = "cancel";
    await appointment.save();
    res.status(200).send({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in cancel appoitnment API",
    });
  }
};

module.exports = {
  createAppointment,
  getAllappointment,
  getAppointmentDetail,
  updateAppointmentStatus,
  getUserAppointment,
  getUserAppointmentDetail,
  cancelAppointment,
};
