const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    //validation
    if (!name || !email || !password || !phone) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }

    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword, phone };

    //create new user
    const newUser = new userModel(userData);
    //save user
    const user = await newUser.save();

    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ sucess: false, message: "Something went wrong", error });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "email or password not provided.",
      });
    }

    //find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    //match password
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return res.status(402).send({
        success: false,
        message: "invalid credentials",
      });
    }

    //creating token with id object and user me jo id hai
    const token = JWT.sign({ id: user?._id }, process.env.JWT_SECRET, { expiresIn: "5d" });
    //if I dont want to send password i will do
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ sucess: false, message: "Something went wrong", error });
  }
};

//update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "userid not found",
      });
    }
    const { name, phone, image, address, dob, gender } = req.body;
    const imageToBuffer64 = req.file && req.file.buffer.toString("base64");
    const user = await userModel.findByIdAndUpdate(
      id,
      { $set: { name, phone, address, dob, gender, image: imageToBuffer64 } },
      { returnOriginal: false },
    );

    res.status(200).send({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in user update api",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    //get user id from params
    const { id } = req.params;
    if (!id) {
      return res.status(402).send({
        success: false,
        message: "user not found",
      });
    }
    //get req from user for password from req.body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Provide old and new password",
      });
    }
    //find user
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(402).send({
        success: false,
        message: "user not found",
      });
    }
    //check old password
    const isMatch = await bcrypt.compare(oldPassword, user?.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Password not matched",
      });
    }
    //hashsing for the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //update the user with new password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in password update API",
      error,
    });
  }
};

//get all user
const getAllUser = async (req, res) => {
  try {
    //we are returning required data not full to optimise laod time
    const users = await userModel.find().select("name email phone");
    res.status(200).send({
      success: true,
      message: "All users fetched",
      totalCount: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get all user API",
      error,
    });
  }
};

//get single user and appointment
const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "please provide id",
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No user found",
      });
    }
    //find appointment
    const appointment = await appointmentModel.find({ userId: user?._id });
    res.status(200).send({
      success: true,
      message: "Details fetched successfully",
      user,
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get user detail API",
      error,
    });
  }
};

//get stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalDoctors = await doctorModel.countDocuments();
    const totalAppointments = await appointmentModel.countDocuments();
    //we have amounts in appointments so we need to calculate amounts and send it as a res as totalEarning.
    //.aggregate() because we want to fire a query.
    const appointments = await appointmentModel.aggregate([
      { $group: { _id: null, totalEarning: { $sum: "$amount" } } },
    ]);

    const total = appointments.length > 0 ? appointments[0].totalEarning : 0;
    res.status(200).send({
      success: true,
      message: "All Stats fetched",
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        earnings: total,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get Stats API",
      error,
    });
  }
};

//get login user
const getLoginUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Please provide user id",
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "user details fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get all user API",
      error,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  updateUser,
  resetPassword,
  getAllUser,
  getUserDetail,
  getStats,
  getLoginUser,
};
