const webMsgModel = require("../models/webMsgModel");

const createWebMsg = async (req, res) => {
  try {
    const { name, contact, message } = req.body;
    if (!name || !contact || !message) {
      return res.status(402).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const webMessage = new webMsgModel({ name, contact, message });
    await webMessage.save();

    res.status(200).send({
      success: true,
      message: "Message sent",
      webMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in web message API",
    });
  }
};

//get all messages
const getAllWebMsg = async (req, res) => {
  try {
    const webMessage = await webMsgModel.find({});
    res.status(201).send({
      success: true,
      message: "All web messages",
      totalCount: webMessage.length,
      webMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all web message API",
    });
  }
};

//delete message
const deleteWebMsg = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide message id",
      });
    }
    //find message
    // const webMessage = await webMsgModel.findById(id)
    // if(!webMessage){
    //     return res.status(404).send({
    //         success:"false",
    //         message:"Message not found with this id"
    //     })
    // }

    //or better : findByIdDelete
    const webMessage = await webMsgModel.findByIdAndDelete(id);
    res.status(201).send({
      success: true,
      message: "Web message deleted",
      webMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete web message API",
    });
  }
};

module.exports = { createWebMsg, getAllWebMsg, deleteWebMsg };
