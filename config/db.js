const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/appointment-app-v2`);
    console.log("MongoDB connected succesfully: ", conn.connection.name);
  } catch (error) {
    console.log("MongoDB connection failed: ", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
