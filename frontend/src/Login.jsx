// filepath: d:/ResuMingle/frontend/src/Login.jsx
import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const companyOptions = ["Google", "Microsoft", "Amazon", "Facebook", "Apple"]; // Example list

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    Axios.post('http://localhost:3000/auth/login', { email, password, company })
      .then(response => {
        if (response.data.status) {
          if (response.data.role === "member") {
            navigate('/adminDashboard'); 
          } else {
            navigate('/upload'); 
          }
        } else {
          setError(response.data.message); // Set the error message
        }
      })        
      .catch((error) => {
        setError("An error occurred. Please try again."); // Set a generic error message
        console.log(error);
      });
  };

  return (
    <div className="bg">
      <div className="sign-up-container">
        <h1 className="logo">ResuMingle</h1>
        <h2>Log In</h2>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            autoComplete="email"  
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="****"
            autoComplete="current-password" 
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="company">Company</label>
          <select 
            id="company" 
            name="company" 
            onChange={(e) => setCompany(e.target.value)} 
            required
            autoComplete="organization" 
          >
            <option value="">Select a Company</option>
            {companyOptions.map((comp, index) => (
              <option key={index} value={comp}>{comp}</option>
            ))}
          </select>

          <button className="signup-button" type="submit">Log In</button><br></br>
          <Link to="/forgotPassword">Forgot Password</Link>
          <p>Don't have an account? <Link to="/signup">Sign Up Here</Link></p>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </form>
      </div>
    </div>
  );
};

export default Login;