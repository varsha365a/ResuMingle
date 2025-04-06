import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await Axios.post("http://localhost:3000/api/user/login", { email, password, company });

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response from server");
      }

      if (response.data.status) {
        console.log("Login successful, Role:", response.data.role);

        if (response.data.role === "member") {
          const postStatusRes = await Axios.get("http://localhost:3000/api/posts/has-posted");

          if (postStatusRes.data && postStatusRes.data.hasPosted) {
            // If the user has already posted, redirect to /posts
            navigate("/posts");
          } else {
            // Otherwise, redirect to /upload
            navigate("/upload");
          }
        } else if (response.data.role === "admin") {
          navigate("/adminDashboard");
        } else {
          // Fallback for any other roles
          navigate("/upload");
        }
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
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
            {["Amrita Pest Control Pvt. Ltd.", "ID Tag Systems", "Wipro", "TCS"].map((comp, index) => (
              <option key={index} value={comp}>
                {comp}
              </option>
            ))}
          </select>

          <button className="signup-button" type="submit">
            Log In
          </button>
          <br />
          <Link to="/forgotPassword">Forgot Password</Link>
          <p>
            Don't have an account? <Link to="/signup">Sign Up Here</Link>
          </p>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </form>
      </div>
    </div>
  );
};

export default Login;