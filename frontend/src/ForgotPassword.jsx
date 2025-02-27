import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../src/App.css";
import Axios from "axios";

const ForgotPassword = () => {
        const [email, setEmail] = useState("");
    
        const navigate = useNavigate();
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            Axios.post('http://localhost:3000/auth/forgot-password', { 
                email, 
            }) 
            .then(response => {
                if(response.data.status){
                    alert("Password reset link sent to your email");
                    navigate('/login');
                }
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }

    return (
        <div className="sign-up-container">
            <h1 className="logo">ResuMingle</h1>
            <h2>Forgot Password</h2>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}
export default ForgotPassword;