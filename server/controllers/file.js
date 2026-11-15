const crypto = require("crypto");
const cloudinary = require("../Config/cloudinary");
const File = require("../model/file");
const folder = require("../model/folder");

/* ---------- helpers ---------- */

// The browser tells us the file type, but it can be faked, so we also look
// at the first bytes of the file ("magic numbers") to confirm it.
function detectFileType(buffer) {
  if (buffer.length < 4) return null;

  const isPng =
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  if (isPng) return "image/png";

  const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpg) return "image/jpeg";

  const isPdf =
    buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  if (isPdf) return "application/pdf";

  return null;
}

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// Returns the folder only if it belongs to the logged-in user.
// (The authenticator middleware stores the user id on res.userId.)
async function findOwnedFolder(folderId, userId) {
  const found = await folder.findById(folderId);
  if (!found) return null;
  if (String(found.folderCreator) !== String(userId)) return null;
  return found;
}

/* ---------- route handlers ---------- */

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file received" });
    }

    const { folderId } = req.params;
    const ownedFolder = await findOwnedFolder(folderId, res.userId);
    if (!ownedFolder) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    const realType = detectFileType(req.file.buffer);
    if (!realType) {
      return res.status(400).json({ msg: "Only PNG, JPG and PDF files are allowed" });
    }

    const isPdf = realType === "application/pdf";
    const uniqueName = crypto.randomUUID();

    // Images are stored as "image"; PDFs as "raw" so they download as-is.
    const result = await uploadBuffer(req.file.buffer, {
      folder: `notes-app/${folderId}`,
      public_id: isPdf ? `${uniqueName}.pdf` : uniqueName,
      resource_type: isPdf ? "raw" : "image",
    });

    const saved = await File.create({
      folderId,
      userId: String(res.userId),
      originalName: req.file.originalname,
      mimeType: realType,
      size: req.file.size,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });

    res.status(201).json({ file: saved, msg: "File uploaded" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Upload failed, please try again" });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const ownedFolder = await findOwnedFolder(req.params.folderId, res.userId);
    if (!ownedFolder) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    const files = await File.find({ folderId: req.params.folderId }).sort({
      createdAt: -1,
    });
    res.json({ files, msg: "Folder files" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not load files" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file || file.userId !== String(res.userId)) {
      return res.status(404).json({ msg: "File not found" });
    }

    // Remove from Cloudinary first. If that fails we keep the database record
    // so the user can simply try again, instead of leaving an orphaned file.
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });
    await file.deleteOne();

    res.json({ msg: "File deleted" });
  } catch (error) {
    console.log(error);
    res.status(502).json({ msg: "Could not delete the file, please try again" });
  }
};

// Used when a whole folder is deleted, so no files are left behind.
exports.deleteFilesOfFolder = async (folderId) => {
  try {
    const files = await File.find({ folderId: String(folderId) });
    await Promise.allSettled(
      files.map((file) =>
        cloudinary.uploader.destroy(file.publicId, { resource_type: file.resourceType })
      )
    );
    await File.deleteMany({ folderId: String(folderId) });
  } catch (error) {
    console.log(error);
  }
};
