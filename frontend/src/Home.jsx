import React from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../src/Styles.css";

const Home = () => {
    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;

    const handleLogout = () => {
        Axios.get('http://localhost:3000/auth/logout')
        .then(res => {
            if(res.data.status){
                navigate('/login');
            }
        }).catch(err => {
            return res.json(err);
        });
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Home</h1>
                <div className="buttons">
                    <Link to="/dashboard"><button className="btn">Dashboard</button></Link>
                    <button onClick={handleLogout} className="btn">Logout</button>
                </div>  
            </div>
        </div>
    );
};

export default Home;
