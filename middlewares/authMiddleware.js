const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

//user auth
const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Not authorized, please log in",
      });
    }
    //veryfying token
    const decode = JWT.verify(token, process.env.JWT_SECRET);

    //storing decode
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(402).send({
      success: false,
      message: "Error in user auth",
      error,
    });
  }
};

// admin auth
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (user.isAdmin === !true) {
      return res.status(402).send({
        success: false,
        message: "Un-authorize access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(402).send({
      success: false,
      message: "Error in admin auth",
      error,
    });
  }
};

module.exports = { userAuth, isAdmin };
