import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/signup', { 
            username, 
            email, 
            password, 
        }, { withCredentials: true }) // Ensure withCredentials is set to true
        .then(response => {
            if(response.data.status){
                navigate('/login');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="bg">
        <div className="sign-up-container">
            <h1 className="logo">ResuMingle</h1>
            <h2>Sign Up</h2>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="****"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                <p>Have an account already? <Link to="/login">Login Here</Link></p>
            </form>
        </div>
        </div>
    );
}

export default Signup;