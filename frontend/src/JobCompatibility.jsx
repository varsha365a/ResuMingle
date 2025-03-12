import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "./JobCompatibility.css";
import Confetti from "react-confetti";

const JobCompatibility = () => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("🤔");
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    Axios.get(`http://localhost:3000/api/posts/${postId}/compatibility`)
      .then((res) => {
        setTimeout(() => {
          setCompatibilityScore(res.data.score);
          setLoading(false);
          determineMessage(res.data.score);
          if (res.data.score >= 80) {
            setConfetti(true); // 🎉 Confetti if score is high
          }
        }, 3000);
      })
      .catch((err) => console.error("Error fetching compatibility score:", err));
  }, [postId]);

  const determineMessage = (score) => {
    if (score >= 80) {
      setMessage("🚀 You're an **excellent match**! This job is perfect for you!");
      setEmoji("🎉");
    } else if (score >= 60) {
      setMessage("🔥 You're a **good match**! You have most of the required skills.");
      setEmoji("😃");
    } else if (score >= 40) {
      setMessage("⚡ You're a **decent match**! A little improvement can boost your chances.");
      setEmoji("😊");
    } else {
      setMessage("📚 You need to **improve your skills** for this role.");
      setEmoji("😕");
    }
  };

  return (
    <div className="compatibility-container">
      {confetti && <Confetti />}
      <h1 className="page-title">Job Compatibility Analysis</h1>
      {loading ? (
        <div className="loading-animation">
          <div className="shimmer-text">Calculating Compatibility...</div>
        </div>
      ) : (
        <div className="result-section">
          <div className="score-box">
            <h2>Your Compatibility Score</h2>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${compatibilityScore}%` }}
              ></div>
            </div>
            <p className="score-text">{compatibilityScore}%</p>
          </div>
          <p className="emoji">{emoji}</p>
          <p className="message">{message}</p>
        </div>
      )}
    </div>
  );
};

export default JobCompatibility;
