const mongoose = require("mongoose");
const Note = require("./model/notes.js");
const Folder = require("./model/folder.js");
const User = require("./model/user.js");

require("dotenv").config({ path: "./Config/config.env" });
async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB DB");
        
        // 1. Create a dummy user
        const user = new User({ username: "verif_user", email: "verif3@example.com", password: "password" });
        await user.save();
        console.log("Created user:", user._id);

        // 2. Create normal note
        const normalNote = new Note({ title: "Normal Note", content: "No folder", userId: user._id });
        await normalNote.save();
        console.log("Created normal note:", normalNote._id);
        
        // 3. Create folder
        const folder = new Folder({ folderName: "Test Folder", folderCreator: user._id });
        await folder.save();
        console.log("Created folder:", folder._id);
        
        // 4. Create note for folder
        const folderNote = new Note({ title: "Folder Note", content: "Inside folder", userId: user._id });
        await folderNote.save();
        console.log("Created note to add to folder:", folderNote._id);
        
        // 5. Add note to folder (simulating controller)
        await Folder.findByIdAndUpdate(folder._id, { $push: { folderNotes: folderNote._id } });
        await Note.findByIdAndUpdate(folderNote._id, { folderId: folder._id, folderName: folder.folderName });
        
        // 6. Verify
        const verifyNormal = await Note.findById(normalNote._id);
        console.log("\n--- Normal Note Verification ---");
        console.log("Title:", verifyNormal.title);
        console.log("folderId:", verifyNormal.folderId);
        
        const verifyFolder = await Note.findById(folderNote._id);
        console.log("\n--- Folder Note Verification ---");
        console.log("Title:", verifyFolder.title);
        console.log("folderId:", verifyFolder.folderId);
        console.log("folderName:", verifyFolder.folderName);
        
        // Cleanup
        await User.findByIdAndDelete(user._id);
        await Note.findByIdAndDelete(normalNote._id);
        await Note.findByIdAndDelete(folderNote._id);
        await Folder.findByIdAndDelete(folder._id);
        console.log("\nCleanup complete");
        
    } catch(err) { console.error(err); } finally { mongoose.connection.close(); }
}
verify();
