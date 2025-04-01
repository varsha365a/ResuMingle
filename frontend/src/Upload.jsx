import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/webpack";
import "../src/Styles.css";
import { FaUserLarge } from "react-icons/fa6";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  // Company-Roles Mapping
  const companyRoles = {
    "Amrita Pest Control Pvt. Ltd.": ["Pest Control Operator", "Supervisor"],
    "ID Tag Systems": ["Receptionist", "Designer", "Assistant Operator"],
    "Wipro": ["Frontend Developer", "Backend Developer"],
    "TCS": ["Full Stack Developer"]
  };

  Axios.defaults.withCredentials = true;

  // Fetch User Data from `/auth/user`
  useEffect(() => {
    Axios.get("http://localhost:3000/auth/user")
      .then((res) => {
        console.log("Fetched User Data:", res.data); // Debugging Log
        if (res.data.company) {
          setSelectedCompany(res.data.company);
          setRoles(companyRoles[res.data.company] || []);
        }
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, []);

  // Logout Function
  const handleLogout = () => {
    Axios.get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => console.error(err));
  };

  // File Upload & PDF Extraction
  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    console.log("Selected File:", uploadedFile);

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

          console.log("Extracted Text:", extractedText); // Debugging Log
          setText(extractedText);
        } catch (err) {
          console.error("Error extracting text from PDF:", err);
          setText("Failed to extract text.");
        }
      };
    }
  };

  // Posting Data to Backend
  const handlePost = async () => {
    if (!selectedCompany || !selectedRole) {
      alert("Please select a role.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("pdf", file);
    formData.append("company", selectedCompany);
    formData.append("role", selectedRole);

    console.log("Posting Data:", { text, file, selectedCompany, selectedRole }); // Debugging Log

    try {
      await Axios.post("http://localhost:3000/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/posts");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
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
      <br />

      {/* Display Fetched Company */}
      <div>
        <label>Company:</label>
        <input type="text" value={selectedCompany} readOnly />
      </div>

      <br />

      {/* Role Selection */}
      {roles.length > 0 ? (
        <div>
          <label>Select Role:</label>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
      ) : (
        <p>No roles available</p>
      )}

      <br />

      <h1 className="upload-heading">Upload a Resume</h1>
      <div className="upload-box">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {file && <p>Uploaded: {file.name}</p>}
      </div>

      {text && (
        <div className="text-container">
          <h3>Extracted Resume Text:</h3>
          <textarea value={text} readOnly rows="10" cols="50" />
        </div>
      )}

      {text && <button onClick={handlePost} className="btn">Post</button>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Upload;
