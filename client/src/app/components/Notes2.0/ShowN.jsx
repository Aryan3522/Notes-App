import { AuthContext } from "@/app/context/AuthContext";
import { FolderContext } from "@/app/context/folder";
import { NotesContext } from "@/app/context/NotesContext";
import React, { useContext, useState, useEffect } from "react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const ShowN = ({ SetShowNote, setWriteNote }) => {
  const { showNote, deleteNote, dispatch, GetNotes, updateNotes } =
    useContext(NotesContext);
  const { AuthData } = useContext(AuthContext);
  const [AddInFolder, SetAddInFolder] = useState(null);
  const { folders,AddNoteInFolder } = useContext(FolderContext);
  const [Border, SetBorder] = useState("none");
  const [Data, SetData] = useState({
    NoteId:"",
    _id: "",
    folderName: "",
    folderCreator: "",
    folderNotes: [],
    color: "",
    isArchived: false,
    createdAt: "",
    updatedAt: "",
  });
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
  if (showNote?._id && folders?.Folders) {
    const isNoteInAnyFolder = folders.Folders.some((folder) => 
      folder.folderNotes.includes(showNote._id)
    );
    
    setIsAssigned(isNoteInAnyFolder);
  }
}, [showNote, folders]);
 
  

  async function DeleteNotes(authdata,body) {
    try {
      const status = await deleteNote(authdata,body);
      if (status == 200) {
        let data = await GetNotes(AuthData);
        dispatch({
          type: "GET_ALL_NOTES",
          payload: data,
        });
        SetShowNote(false);
        toast.success('Note deleted successfully', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'light',
          transition: Bounce,
        });

      }
    } catch (error) {
      console.log(error);
      toast.error('Error deleting note', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
      });
    }
  }

async function ADDNOTEINFOLDER(authData, body) {
    try {
      const status = await AddNoteInFolder(authData, body);
      if (status == 200) {
        SetAddInFolder(false);
        setIsAssigned(true);
        toast.success('Note added to folder successfully', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'light',
          transition: Bounce,
        });
        
        let data = await GetNotes(AuthData);
        dispatch({
          type: "GET_ALL_NOTES",
          payload: data,
        });

      } else {
        console.log("file already exists");
        toast.error('Note is already in the folder', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'light',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function UPDATENOTE(id) {
    try {
      const status = await updateNotes(id);
      if (status == 200) {
        let data = await GetNotes(AuthData);
        dispatch({
          type: "GET_ALL_NOTES",
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {AddInFolder ? (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", widows: "800px" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Note In Folder</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => SetAddInFolder(false)}
                ></button>
              </div>
              <div
                className="modal-body bg-dark"
                style={{ overflowY: "scroll", height: "200px" }}
              >
                {folders?.Folders?.map((ele,i) => {
                  return (
                    <div
                    key={i}
                      className="d-flex mt-1"
                      style={{
                        cursor: "pointer",
                        border:
                          Border == ele.folderName ? "2px solid white" : "none",
                      }}
                      onClick={() => {
                        SetBorder(ele.folderName);
                        SetData({...ele,NoteId:showNote._id});
                      }}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="yellow"
                          class="bi bi-folder-plus"
                          viewBox="0 0 16 16"
                        >
                          <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" />
                          <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </span>
                      <h5 className="ms-3" style={{ color: "white" }}>
                        {ele.folderName}
                      </h5>
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                   ADDNOTEINFOLDER(AuthData,Data)
                  }}
                >
                  {`Add in ${Data.folderName || ""}`}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => SetAddInFolder(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="card shadow "
          style={{
            width: "84%",
            height:"87vh",
            backgroundColor: "rgba(0, 0, 0, 0.84)",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <button
            className="btn-close position-absolute"
            style={{ top: "16px", right: "16px", backgroundColor: "white" }}
            onClick={() => SetShowNote(false)}
          ></button>

          <div className="d-flex" style={{ width: "100%" }}>
            <div className="d-flex" style={{ width: "50%" }}>
              {showNote?.tags?.map((ele,i) => {
                return (
                  <h5 key={i} className="ms-3" style={{ color: "white" }}>
                    #{ele}
                  </h5>
                );
              })}
            </div>
            <div
              className="d-flex justify-content-end"
              style={{ width: "50%" }}
            >
              <button
                className={`btn me-2 ${isAssigned ? "btn-success" : "btn-outline-primary"}`}
                disabled={isAssigned}
                onClick={() => {
                  // UPDATENOTE(showNote._id)
                  // setWriteNote(true)
                  // SetShowNote(false)
                  SetAddInFolder(true);
                  SetData(prev=>({...prev,NoteId:showNote._id}))
                }}
              >
               {isAssigned ? (
                <>
                  Added to Folder
                </>
              ) : (
                "Add Note In Folder"
              )}
              </button>
              <button
                className="btn btn-outline-danger me-5"
                onClick={() => {
                  // console.log(showNote);
                  let data = { id: showNote._id, userId: showNote.userId };
                  // console.log(data);
                  DeleteNotes(AuthData,data);
                }}
              >
                Delete Note
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
              }}
            >
              {showNote.title}
            </h2>
          </div>
          <div className="mt-2">
            <p
              style={{
                fontSize: showNote.Filters[0].FontSize,
                lineHeight: "1.6",
                color: showNote.Filters[0].Color || "white",
                fontFamily: showNote.Filters[0].font,
                textTransform: showNote.Filters[0].case,
              }}
            >
              {showNote.content}
            </p>
          </div>
        </div>
      )}

    </>
  );
};
