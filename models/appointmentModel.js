const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending", enum: ["pending", "completed", "cancel"] },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const appointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = appointmentModel;
