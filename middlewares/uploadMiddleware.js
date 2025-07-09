const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Folder to save uploaded files
  },
  filename: function (req, file, cb) {
    // To avoid overwriting, add timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Max file size ~2MB
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
