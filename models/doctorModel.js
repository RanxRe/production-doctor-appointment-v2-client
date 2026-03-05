const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
    },
    fee: {
      type: Number,
      required: [true, "Fees is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    about: {
      type: String,
      required: [true, "About is required"],
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const doctorModel = mongoose.model("doctor", doctorSchema);

module.exports = doctorModel;
