const mongoose = require("mongoose");

const webMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number or email is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
  },
  { timestamps: true },
);

const webMsgModel = mongoose.model("webMessage", webMessageSchema);

module.exports = webMsgModel;
