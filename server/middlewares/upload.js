const multer = require("multer");

/*
  The server runs on Vercel (serverless), which has no writable disk and
  limits request bodies to about 4.5 MB. So files are kept in memory only
  while they are being forwarded to Cloudinary, and the limit stays at 4 MB.
*/
const MAX_FILE_SIZE_MB = 4;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "application/pdf"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG and PDF files are allowed"));
    }
  },
});

// Wraps multer so that upload problems become a clean 400 response
// instead of an unhandled error.
exports.uploadSingleFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      const msg =
        error.code === "LIMIT_FILE_SIZE"
          ? `File is too large (max ${MAX_FILE_SIZE_MB} MB)`
          : error.message;
      return res.status(400).json({ msg });
    }
    return res.status(400).json({ msg: error.message });
  });
};

exports.MAX_FILE_SIZE_MB = MAX_FILE_SIZE_MB;
