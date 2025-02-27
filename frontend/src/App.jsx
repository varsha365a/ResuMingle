import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from "./Signup";
import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
