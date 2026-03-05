const multer = require("multer");

const storage = multer.memoryStorage();

const filefilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("only images are allowed"), false);
  }
};
const upload = multer({ storage, filefilter });

module.exports = upload;
