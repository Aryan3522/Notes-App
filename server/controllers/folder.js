const { json } = require("body-parser")
const folder = require("../model/folder")
const User = require("../model/user")
const Note = require("../model/notes")
const { deleteFilesOfFolder } = require("./file")

function FolderNotesList(AllNOTES,findNotes){
    try {
    let NotesList = []
     AllNOTES?.forEach((e)=>{
      for(let i=0;i<findNotes.folderNotes.length;i++){
        // console.log(e._id,findNotes.folderNotes[i]);
        if(e._id==findNotes.folderNotes[i]){
          NotesList.push(e)
        }
      }
    })
    return NotesList
    } catch (error) {
        console.log(error);
    }    
  }

exports.createfolder = async(req,res)=>{
    try {
        // const ID = JSON.stringify(req.params.id)
        const FolderName = new folder({...folder,...req.body,folderCreator:req.params.id}) 
        const userfolder =await User.findByIdAndUpdate(req.params.id,{
            $push:{folders:FolderName._id}
        })
        const user = await new User({...User,folders:userfolder})
        const createdfolder = await FolderName.save()
        res.send({user,createdfolder,msg:"folderCreated"})
    } catch (error) {
        console.log(error);
    }
}

exports.getfolders = async(req,res)=>{
    try {
        const Folders = await folder.find({folderCreator:req.params.id})
        res.send({Folders,msg:"Your floder"})
    } catch (error) {
       console.log(error);
    }
}

exports.addnotesInfolder = async(req,res)=>{
    try {
        const folderData = await folder.findById(req.body._id)
        let isinfolder = false
         folderData.folderNotes.forEach((ele)=>{
            if(ele==req.body.NoteId){
                 isinfolder = true
            }
        })

       if(!isinfolder){
        const Folder = await folder.findByIdAndUpdate(req.body._id,{
            $push:{folderNotes:req.body.NoteId}
        })
        // Stamp folderId and folderName on the note so NoteCard can show the folder icon
        await Note.findByIdAndUpdate(req.body.NoteId, {
            folderId: req.body._id,
            folderName: folderData.folderName
        })
        res.send({Folder,msg:"note added in folder"})
       }else{
          res.send("file already exists")
       }
    } catch (error) {
        console.log(error);
    }
}

exports.deletenotesfromfolder = async(req,res)=>{
    try {
        const {folderId,NoteId} = req.body
        const Folder =await folder.findById(folderId)
        const updatefolder = Folder.folderNotes.filter((ele)=>{

            if(ele.toString() !== NoteId){
                return ele
            }

        })

        await folder.findByIdAndUpdate(folderId,{
            $set:{folderNotes:updatefolder}
        })
        // Clear folderId and folderName from the note so folder icon disappears
        await Note.findByIdAndUpdate(NoteId, {
            folderId: null,
            folderName: null
        })
        res.send({folder,updatefolder,msg:"note deleted"})
    } catch (error) {
        console.log(error);
    }
}

exports.deletefolder = async(req,res)=>{
    try {
        const deletedfolder = await folder.findByIdAndDelete({_id:req.params.id})
        // Also remove the files uploaded into this folder (database + Cloudinary)
        await deleteFilesOfFolder(req.params.id)
        res.send({deletedfolder,msg:"folder Deleted"})
    } catch (error) {
        console.log(error);
    }
}

exports.getfolderNotelist = async(req,res)=>{
    try {
        const Folder = await folder.findById(req.query.folderId)
        const Notes = await Note.find({userId:req.query.NoteId})
        const FolderNotes = FolderNotesList(Notes,Folder)
        res.send({FolderNotes,msg:"Your Folder Notes"})
    } catch (error) {
        console.log(error);
    }
}