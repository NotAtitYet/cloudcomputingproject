import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import './Home.css'

const Home = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  // const token=null
  const token = localStorage.getItem("token");
  console.log(token);
  // Fetch list of files
  React.useEffect(() => {
    if (user) {
      fetchFiles();
    }
    // setFiles([{name : "Nilesh"},{name : "Lund Single"}])
  }, [user]);
  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/auth/getFiles",
        {
          headers: {
            authorization: token,
          }
        }
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };


  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:8080/api/v1/auth/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
      });
      alert("File uploaded successfully!");
      await fetchFiles(); // Refresh the list of files
      console.log(files)
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Failed to upload file");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/auth/delete/${fileId}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      alert("File deleted successfully!");
      fetchFiles(); // Refresh the list of files
    } catch (error) {
      console.error("File deletion failed:", error);
      alert("Failed to delete file");
    }
  };

  // Fetch files when component mounts
  

  if (!user.name) {
    return (
      <div className="home-not-logged-in">
        <h1>Welcome to FileHub!</h1>
        <p>
          Please <a href="/signup">Sign Up</a> to view and manage your files.
        </p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Welcome, {user.name}!</h1>

      {/* File Upload Form */}
      <form className="upload-form" onSubmit={handleFileUpload}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      {/* List of Files */}
      <div className="files-list">
        <h2>Available Files</h2>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                <div className="file-info">
                  <a href={file.fileURL} download>
                    {file.fileName}
                  </a>
                  <div className="file-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(file._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;