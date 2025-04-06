import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Upload from "./Upload";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Posts from "./Posts";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";
import JobCompatibility from "./JobCompatibility"; 
import MemberDash from "./MemberDash";
import "./App.css";
import "./Styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/job-compatibility/:postId" element={<JobCompatibility />} />
        <Route path="/memberDashboard" element={<MemberDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
