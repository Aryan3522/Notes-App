const mongoose = require("mongoose");
const Note = require("./model/notes.js");

require("dotenv").config({ path: "./Config/config.env" });
async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB DB");
        
        const noteDoc = await Note.findOne({ folderId: { $ne: null } });
        if (noteDoc) {
             console.log("NOTE IN FOLDER:", { id: noteDoc._id, title: noteDoc.title, folderId: noteDoc.folderId, folderName: noteDoc.folderName });
        } else {
             console.log("No notes with folderId found yet.");
        }
        
        const normalNote = await Note.findOne({ folderId: null });
        if(normalNote) {
             console.log("NORMAL NOTE:", { id: normalNote._id, title: normalNote.title, folderId: normalNote.folderId, folderName: normalNote.folderName });
        } else {
             console.log("No notes without folderId");
        }
        
    } catch(err) { console.error(err); } finally { mongoose.connection.close(); }
}
verify();
