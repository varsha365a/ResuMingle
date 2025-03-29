import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/webpack";
import "../src/Styles.css";
import { FaUserLarge } from "react-icons/fa6";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const companyRoles = {
    "Amrita Pest Control Pvt. Ltd.": ["Pest Control Operator", "Supervisor"],
    "ID Tag Systems": ["Receptionist", "Designer", "Assistant Operator"],
    "Wipro": ["Frontend Developer", "Backend Developer"],
    "TCS": ["Full Stack Developer"]
  };

  const [selectedCompany, setSelectedCompany] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const handleCompanyChange = (e) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setRoles(companyRoles[company] || []);
    setSelectedRole(""); 
  };  

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

  useEffect(() => {
    Axios.get("http://localhost:3000/api/posts/has-posted")
      .then((res) => {
        if (res.data.hasPosted) {
          navigate("/posts"); // Redirect to Posts page if the user has already posted
        }
      })
      .catch((err) => console.error("Error checking post status:", err));
  }, [navigate]);

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

  const handlePost = async () => {
    if (!selectedCompany || !selectedRole) {
      alert("Please select a company and a role.");
      return;
    }
  
    const formData = new FormData();
    formData.append("text", text);
    formData.append("pdf", file);
    formData.append("company", selectedCompany);
    formData.append("role", selectedRole);
  
    try {
      await Axios.post("http://localhost:3000/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/posts");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Display error message from the backend
      } else {
        console.error("Error creating post:", err);
      }
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

      <div>
        <label>Select Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">Select Company</option>
          {Object.keys(companyRoles).map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <br></br>

      {roles.length > 0 && (
        <div>
          <label>Select Role:</label>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      )}

      <br></br>

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
