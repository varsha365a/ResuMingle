import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/webpack";
import "../src/Styles.css";
import { FaUserLarge } from "react-icons/fa6";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  Axios.defaults.withCredentials = true;

  const handleLogout = () => {
    Axios.get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => console.error(err));
  };

  // File Upload
  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile && uploadedFile.type === "application/pdf") {
      const reader = new FileReader();
      reader.readAsArrayBuffer(uploadedFile);

      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjs.getDocument(typedArray).promise;
          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            extractedText += pageText + "\n";
          }

          setText(extractedText);
        } catch (err) {
          console.error("Error extracting text from PDF:", err);
          setText("Failed to extract text.");
        }
      };
    }
  };

  // Posting Resume Text
  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("pdf", file);

      await Axios.post("http://localhost:3000/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/posts");
    } catch (err) {
      console.error("Error posting resume:", err);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Home</h1>
        <div className="buttons">
          <div className="dropdown">
            <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaUserLarge />
            </button>
            <div className="dropdown-menu">
                <a className="dropdown-item" href="/dashboard">Dashboard</a>
                <a className="dropdown-item" href="/upload">Home</a>
                <a className="dropdown-item" href="/posts">Posts</a>
              <a className="dropdown-item" onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <h1 className="upload-heading">Upload a Resume</h1>
      <div className="upload-box">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {file && <p>Uploaded: {file.name}</p>}
      </div>
      <Link to="/posts">
        <button className="btn">View Posts</button>
      </Link>

      {/* Extracted Text Container */}
      {text && (
        <div className="text-container">
          <h3>Extracted Resume Text:</h3>
          <textarea value={text} readOnly rows="10" cols="50" />
        </div>
      )}

      {/* Post Button */}
      {text && <button onClick={handlePost} className="post-btn">Post</button>}
    </div>
  );
};

export default Upload;
