import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../src/App.css";
import Axios from "axios";

const ResetPassword = () => {
        const [password, setPassword] = useState("");
        const { token } = useParams();
        const navigate = useNavigate();
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            Axios.post('http://localhost:3000/auth/resetPassword/'+token, { 
                password, 
            }) 
            .then(response => {
                if(response.data.status){
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
            <h2>Reset Password</h2>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <label htmlFor="password">New Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="****"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset</button>
            </form>
        </div>
    )
}
export default ResetPassword;