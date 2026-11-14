const mongoose = require("mongoose");

/*
  One document per uploaded file.
  The file itself lives on Cloudinary; MongoDB only keeps the metadata
  and the link (url) so the database stays small.
*/
const fileSchema = new mongoose.Schema({
  folderId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  // Needed later to delete the file from Cloudinary.
  publicId: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    enum: ["image", "raw"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
