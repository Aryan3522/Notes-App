import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FolderContext } from "@/app/context/folder";

// Must match the limits on the server (server/middlewares/upload.js)
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/*
  Shows the files stored in one folder and lets the user upload
  PNG / JPG / PDF files (max 4 MB) or delete them.
*/
const FolderFiles = ({ folderId, authData }) => {
  const { getFolderFiles, uploadFolderFile, deleteFolderFile } = useContext(FolderContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const loadFiles = useCallback(async () => {
    const data = await getFolderFiles(authData, folderId);
    setFiles(data?.files || []);
    setLoading(false);
  }, [authData, folderId, getFolderFiles]);

  useEffect(() => {
    setLoading(true);
    loadFiles();
  }, [loadFiles]);

  async function handleUpload(event) {
    event.preventDefault();
    setError("");

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG, JPG and PDF files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large (max 4 MB).");
      return;
    }

    setUploading(true);
    const result = await uploadFolderFile(authData, folderId, file);
    setUploading(false);

    if (result.ok) {
      inputRef.current.value = "";
      loadFiles();
    } else {
      setError(result.msg);
    }
  }

  async function handleDelete(file) {
    if (!window.confirm(`Delete "${file.originalName}"?`)) return;
    setError("");

    const result = await deleteFolderFile(authData, file._id);
    if (result.ok) {
      loadFiles();
    } else {
      setError(result.msg);
    }
  }

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.25)" }}>
      <h5 style={{ color: "white" }}>Files</h5>

      <form className="d-flex gap-2 align-items-center flex-wrap" onSubmit={handleUpload}>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
          className="form-control form-control-sm"
          style={{ maxWidth: "260px" }}
          aria-label="Choose a PNG, JPG or PDF file to upload"
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <small style={{ color: "#bbb" }}>PNG, JPG or PDF, up to 4 MB</small>

      {error && (
        <div className="alert alert-danger py-1 px-2 mt-2 mb-0" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-3" style={{ color: "#bbb" }}>Loading files...</p>
      ) : files.length === 0 ? (
        <p className="mt-3" style={{ color: "#bbb" }}>No files in this folder yet.</p>
      ) : (
        <ul className="list-unstyled mt-3 mb-0">
          {files.map((file) => (
            <li key={file._id} className="d-flex align-items-center gap-3 mb-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
                aria-label={`Open ${file.originalName}`}
              >
                {file.mimeType === "application/pdf" ? (
                  <FaFilePdf size={26} color="#d9363e" aria-hidden="true" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.originalName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </a>

              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block text-truncate text-white"
                >
                  {file.originalName}
                </a>
                <small style={{ color: "#bbb" }}>{formatSize(file.size)}</small>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(file)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderFiles;
