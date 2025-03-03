import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import "./Styles.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="start-container">

            <motion.h1 
                className="welcome-text"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome to <span className="highlight">ResuMingle</span>
            </motion.h1>

            <motion.p 
                className="intro-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
            >
                <Typewriter
                    words={[
                        "AI-powered Resume Analysis",
                        "Company-Specific ATS Scoring",
                        "Professional Peer Reviews",
                        "Boost Your Job Application to success",
                    ]}
                    loop={true}
                    cursor
                    cursorStyle="_"
                    typeSpeed={50}
                    deleteSpeed={30}
                    delaySpeed={2000}
                />
            </motion.p>

            <motion.div className="info-cards">
                <motion.div 
                    className="info-card"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <h3>Resume Analyzer</h3>
                    <p>Upload your resume & get instant <b>ATS-friendly feedback </b>.</p>
                </motion.div>

                <motion.div 
                    className="info-card"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <h3>Peer Reviews</h3>
                    <p>Get <b>insights from colleagues, professionals, and former employees</b>.</p>
                </motion.div>

                <motion.div 
                    className="info-card"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <h3>HR & Company Insights</h3>
                    <p>Connect with <b>hiring managers & get company-specific feedback</b>.</p>
                </motion.div>
            </motion.div>

            <motion.button
                className="start-btn"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/signup")}
            >
                Get Started
            </motion.button>
        </div>
    );
};

export default Home;
