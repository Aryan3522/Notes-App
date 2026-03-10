import { AuthContext } from "@/app/context/AuthContext";
import { FolderContext } from "@/app/context/folder";
import { NotesContext } from "@/app/context/NotesContext";
import React, { useContext, useEffect, useState } from "react";
import "./Home2.css";
import "./Note.css";

import { ShowN } from "./ShowN";
import { useRouter } from "next/navigation";
import NoteCard from "./NoteCard";
import FolderCard from "../Folders/FolderCard";


export const Main = ({ setWriteNote, SetShowNote,SetShowAllNotes }) => {
  const {
    folders,
    Folderdispatch,
    getFolders,
    createfolder,
    deletefolder,
    deleteNotesfromfolder,
    getfolderlist,
  } = useContext(FolderContext);
  const { GetNotes, AllNOTES, dispatch, notesdispatch } =
    useContext(NotesContext);
  const { AuthData, Authdispatch } = useContext(AuthContext);
  const [folderModal, setfolderModal] = useState(false);
  const [folderData, setFolderData] = useState({
    folderCreator: AuthData.userId,
  });
  const [folderId, setfolderId] = useState();
  const [FolderList, SetFolderList] = useState(false);
  const [FolderNoteData, SetFolderNoteData] = useState([]);
  const [tokenModal, SettokenModal] = useState(false);
  const [Border, SetBorder] = useState("none");
  const router = useRouter();
  async function LoadFolders(AuthData) {
    try {
      let data = await getFolders(AuthData);
      Folderdispatch({
        type: "GET_FOLDERS",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function CreateFolder(AuthData) {
    try {
      const status = await createfolder(AuthData, folderData);
      if (status == 200) {
        LoadFolders(AuthData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function LoadNotes() {
    try {
      let data = await GetNotes(AuthData);
      if (data == 401) {
        SettokenModal(true);
      }
      dispatch({
        type: "GET_ALL_NOTES",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function DELETEFOLDER(authData, body) {
    try {
      const status = await deletefolder(authData, body);
      if (status == 200) {
        LoadFolders(AuthData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function ShowNotes(data) {
    try {
      notesdispatch({
        type: "SHOW_NOTES",
        payload: data,
      });
      SetShowNote(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function FolderNotesList(authData, body) {
    try {
      const data = await getfolderlist(authData, body);
      SetFolderNoteData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function DELETENOTESFROMFOLDER(authData, body) {
    try {
      const status = await deleteNotesfromfolder(authData, body);
      if (status == 200) {
        FolderNotesList(AuthData, body);
        LoadFolders(AuthData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function SETFOLDERID(id){
    try {
      setfolderId(id)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(!AuthData.token || AuthData.token==" "){
      router.push('/pages/Login')
    }else if(AuthData.userId !== ""){
      LoadFolders(AuthData);
      LoadNotes();
    }
  }, []);
  return (
    <>
      <div
        className="card shadow"
        style={{
          width: "88%",
          height: "90vh",
          backgroundColor: "#f6f8fa",
          border: "none",
        }}
      >
        <div
          className="mt-4 ms-4"
          style={{ width: "90%", height: "33vh", overflow: "hidden" }}
        >
          <h2 className="ms-4" style={{ fontSize: "25px", fontWeight: "700" }}>
            Recent Folders
          </h2>

          {/* Navigation Links */}
          <div
            className="d-flex ms-4 justify-content-between align-items-center"
            style={{ maxWidth: "300px", flexWrap: "wrap" }}
          >
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created today"
            >
              Today
            </a>
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created this week"
            >
              This Week
            </a>
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created this month"
            >
              This Month
            </a>
          </div>

          {/* Folder Cards */}
          <div
            className="d-flex flex-row align-items-center justify-content-start  ms-4"
            style={{ width: "96%", overflowX: "auto" }}
          >
            <ol
              className="d-flex mt-3"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                overflowY: "hidden",
                width: "80%",
                scrollbarWidth: "none"
              }}
            >
             {folders?.Folders?.map((ele, index) => (
  <li key={index} className="folder-card ms-3">
    <FolderCard folder={ele} onFolderClick={FolderNotesList} SetfolderID={SETFOLDERID} SetFolderList={SetFolderList}/>
  </li>
))}

            </ol>
            {/* New Folder Card */}
            <li style={{ listStyle: "none" }}>
              <div
                className="card new-folder-card ms-3 align-self-center"
                style={{
                  width: "7rem",
                  height: "7rem",
                  borderRadius: "20px",
                  border: "dashed 2px #000",
                  cursor: "pointer",
                }}
                onClick={() => setfolderModal(true)}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-file-earmark-fill"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
                  </svg>
                  <h5 className="mt-3" style={{ fontSize: "13px" }}>
                    New Folder
                  </h5>
                </div>
              </div>
            </li>
          </div>
        </div>

        <div className="ms-4 mt-2" style={{ width: "50%", height: "46vh" }}>
          <h2 className="ms-4" style={{ fontSize: "25px", fontWeight: "700" }}>
            My Notes
          </h2>

          {/* Navigation Links */}
          <div
            className="d-flex ms-4 justify-content-between align-items-center"
            style={{ maxWidth: "400px", flexWrap: "wrap" }}
          >
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created today"
            >
              Today
            </a>
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created this week"
            >
              This Week
            </a>
            <a
              className="folder-link"
              href="#"
              aria-label="View folders created this month"
            >
              This Month
            </a>

           <button className="folder-link" style={{backgroundColor:"transparent",border:"none",fontWeight:"500"}} onClick={()=>{
                SetShowAllNotes(true)
              }}>All Notes</button>
          </div>
          <div
            className="containe text-center mt-3"
            style={{ width: "96%", overflowx: "scroll" }}
          >
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
              <ol
                className="d-flex mt-2"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  overflowY: "hidden",
                  width: "90%",
                  scrollbarWidth: "none",
                }}
              >
                {AllNOTES?.Notes?.map((ele, index) => (
  <li key={index} className="folder-card ms-3">
    <NoteCard note={ele} onShowNotes={ShowNotes} />
  </li>
))}

              </ol>
              <div className="add-note me-3 " title="Add More Notes" style={{cursor:"pointer",
                 width: "60px",
                 height: "60px",
                 borderRadius: "50%",
                 backgroundColor: "#F0F0F0",
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 position: "fixed",
                 bottom: "20px",
                 right: "20px",
                 boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }} onClick={()=>{
                setWriteNote(true)
              }}>
              <svg  xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="blue" className="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
</svg>
      </div>
            </div>
          </div>
        </div>
      </div>
      {folderModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", widows: "800px" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setfolderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Folder Name</p>
                <div className="d-flex justify-content-between">
                  <input
                    type="text"
                    placeholder="Folder Name"
                    className="border-none"
                    onChange={(e) => {
                      setFolderData((prev) => {
                        return { ...prev, folderName: e.target.value };
                      });
                    }}
                  />

                  <p>Folder Color</p>
                  <input
                    type="color"
                    placeholder="color"
                    onChange={(e) => {
                      setFolderData((prev) => {
                        return { ...prev, color: e.target.value };
                      });
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    CreateFolder(AuthData);
                    setfolderModal(false);
                  }}
                >
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setfolderModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {FolderList && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", widows: "800px" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => SetFolderList(false)}
                ></button>
              </div>
              <div
                className="modal-body bg-dark"
                style={{ overflowY: "scroll", height: "200px" }}
              >
                {FolderNoteData?.FolderNotes?.length !== 0 ? (
                  FolderNoteData?.FolderNotes?.map((ele,i) => {
                    return (
                      <div
                      key={i}
                        className="d-flex mt-1 justify-content-between"
                        style={{
                          cursor: "pointer",
                          border:
                            Border == ele.folderName
                              ? "2px solid white"
                              : "none",
                        }}
                      >
                        <div
                          className="d-flex"
                          onClick={() => {
                            SetBorder(ele.folderName);
                            ShowNotes(ele);
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="yellow"
                              className="bi bi-file-earmark"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                            </svg>
                          </span>
                          <h5 className="ms-3" style={{ color: "white" }}>
                            {ele.title}
                          </h5>
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-warning ms-5"
                            onClick={() => {
                              const bodyData = {
                                folderId: folderId,
                                NoteId: ele._id,
                              };
                              DELETENOTESFROMFOLDER(AuthData, bodyData);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="d-flex align-itmes-center">
                    <h1 style={{ color: "white" }}>Folder is empty</h1>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    DELETEFOLDER(AuthData, folderId);
                    SetFolderList(false);
                  }}
                >
                  Delete Folder
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => SetFolderList(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tokenModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", widows: "800px" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => SettokenModal(false)}
                ></button>
              </div>
              <div
                className="modal-body d-flex align-items-center justify-content-center flex-column"
                style={{ height: "200px" }}
              >
                <h3>Token Expired</h3>
                <h5>Login Again</h5>
              </div>
              <div className="modal-footer d-flex align-items-center justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    Authdispatch({
                      type: "SIGN_OUT",
                    });
                    router.push("/pages/Login");
                    SettokenModal(false);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
