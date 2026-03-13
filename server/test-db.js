const mongoose = require("mongoose");
const Note = require("./model/notes.js");
const Folder = require("./model/folder.js");

require("dotenv").config({ path: "./Config/config.env" });
async function verifyDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for verification.");

        // Find notes that are in folders
        const notesWithFolders = await Note.find({ folderId: { $ne: null } }).limit(5);
        console.log("\n--- Notes INSIDE Folders ---");
        if (notesWithFolders.length > 0) {
            notesWithFolders.forEach(note => {
                console.log(`Note ID: ${note._id}`);
                console.log(`Title: ${note.title}`);
                console.log(`folderId: ${note.folderId}`);
                console.log(`folderName: ${note.folderName}`);
                console.log("-----------------------");
            });
        } else {
            console.log("No notes with a folderId found.");
        }

        // Find notes that are NOT in folders
        const notesWithoutFolders = await Note.find({ folderId: null }).limit(5);
        console.log("\n--- Notes OUTSIDE Folders ---");
        if (notesWithoutFolders.length > 0) {
            notesWithoutFolders.forEach(note => {
                console.log(`Note ID: ${note._id}`);
                console.log(`Title: ${note.title}`);
                console.log(`folderId: ${note.folderId}`);
                console.log(`folderName: ${note.folderName}`);
                console.log("-----------------------");
            });
        } else {
            console.log("No notes without a folderId found.");
        }

        mongoose.connection.close();
    } catch (err) {
        console.error("Verification failed:", err);
        mongoose.connection.close();
    }
}

verifyDatabase();
