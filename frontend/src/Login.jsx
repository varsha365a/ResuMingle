import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    Axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3000/auth/login', { 
            email, 
            password, 
        })
        .then(response => {
            if(response.data.status){
                navigate('/upload')
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
            <h2>Log In</h2>
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

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="****"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="signup-button" type="submit">Log In</button><br></br>
                <Link to="/forgotPassword">Forgot Password</Link>
                <p>Don't have an account? <Link to="/signup">Sign Up Here</Link></p>
            </form>
        </div>
        </div>
    );
}

export default Login;