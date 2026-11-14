const express = require("express");
const { uploadFile, getFiles, deleteFile } = require("../controllers/file");
const { authenticator } = require("../middlewares/authenticator");
const { uploadSingleFile } = require("../middlewares/upload");

const fileRouter = express.Router();

// POST   /file/upload/:folderId   (multipart form-data, field name: "file")
// GET    /file/list/:folderId
// DELETE /file/delete/:fileId
fileRouter.post("/upload/:folderId", authenticator, uploadSingleFile, uploadFile);
fileRouter.get("/list/:folderId", authenticator, getFiles);
fileRouter.delete("/delete/:fileId", authenticator, deleteFile);

module.exports = fileRouter;
