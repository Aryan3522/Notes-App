"use client"
import { API } from "@/Utils/Utils";
import { createContext, useReducer } from "react";

let FolderS = {}


async function getFolders(authData) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.get(`/folder/getfolders/${authData.userId}`,)
        return responce?.data
    } catch (error) {
        console.log(error);
    }
    
}

async function createfolder(AuthData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${AuthData.token}`
            return req
        })
        const responce = await API.post(`/folder/createfolder/${AuthData.userId}`,body)
        return responce?.status
    } catch (error) {
        console.log(error);
    }
}

async function AddNoteInFolder(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.put(`/folder/addnotesInfolder/`,body)
        return responce?.status
    } catch (error) {
        console.log(error);
    }
}

async function deletefolder(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.delete(`/folder/deletefolder/${body}`)
        return responce?.status
    } catch (error) {
        console.log(error);
    }
}

async function deleteNotesfromfolder(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.put("/folder/deletenotesfromfolder",body)
        return responce?.status
    } catch (error) {
        console.log(error);
    }
}

async function getfolderlist(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.get(`/folder/getfolderNotelist`,{params:body})
        return responce?.data
    } catch (error) {
        console.log(error);
    }
}



/* ---------- files inside folders ---------- */

function authHeaders(authData) {
    return { authorization: `bearer ${authData.token}` }
}

async function getFolderFiles(authData, folderId) {
    try {
        const responce = await API.get(`/file/list/${folderId}`, { headers: authHeaders(authData) })
        return responce?.data
    } catch (error) {
        console.log(error);
    }
}

// Returns { ok: true } or { ok: false, msg } so the UI can show the server's message.
async function uploadFolderFile(authData, folderId, file) {
    try {
        const formData = new FormData()
        formData.append("file", file)
        await API.post(`/file/upload/${folderId}`, formData, { headers: authHeaders(authData) })
        return { ok: true }
    } catch (error) {
        console.log(error);
        return { ok: false, msg: error?.response?.data?.msg || "Upload failed, please try again" }
    }
}

async function deleteFolderFile(authData, fileId) {
    try {
        await API.delete(`/file/delete/${fileId}`, { headers: authHeaders(authData) })
        return { ok: true }
    } catch (error) {
        console.log(error);
        return { ok: false, msg: error?.response?.data?.msg || "Could not delete the file" }
    }
}

export const FolderContext =createContext()

function reducer(state,action){
    switch(action.type){
        case"GET_FOLDERS":
        let FolderState = {...action.payload}
        return FolderState

        default:state
    }
}

export const FolderProvider = ({children})=>{
    const [state,Folderdispatch] = useReducer(reducer,FolderS)
    return(
        <FolderContext.Provider value={{folders:state,Folderdispatch,getFolders,createfolder,AddNoteInFolder,deletefolder,deleteNotesfromfolder,getfolderlist,getFolderFiles,uploadFolderFile,deleteFolderFile}}>
            {children}
        </FolderContext.Provider>
    )
}

