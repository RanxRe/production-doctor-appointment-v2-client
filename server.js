const express = require("express");
const dotenv = require("dotenv");

// dotenv config
dotenv.config();

const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
const testRoute = require("./routes/testRoute");
const userRoutes = require("./routes/userRoutes");
const webMsgRoutes = require("./routes/webMsgRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// express object
const app = express();

//connect DB
connectDB();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API routes
app.use("/api/v1", testRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/webmessage", webMsgRoutes);

// user frontend
app.use(express.static(path.join(__dirname, "./client/dist")));

// admin frontend
app.use("/admin", express.static(path.join(__dirname, "../doc-app-admin-panel/dist")));

//admin routes
app.get("/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../doc-app-admin-panel/dist/index.html"));
});

//user routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

const PORT = process.env.PORT || 5000;

// run server
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
