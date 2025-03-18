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
  const [progressColor, setProgressColor] = useState("#ffcc00");

  useEffect(() => {
    const fetchCompatibilityScore = async () => {
        try {
            const res = await Axios.get(`http://localhost:3000/api/posts/${postId}/compatibility`);
            const score = res.data.score;

            // Add a small delay to simulate processing
            setTimeout(() => {
                setCompatibilityScore(score);
                setLoading(false);
                determineMessage(score);
                
                if (score >= 80) {
                    setConfetti(true);
                }

                // 🔹 Automatically save the score in the user's database
                saveScoreToDB(postId, score);
            }, 2000);
        } catch (err) {
            console.error("Error fetching compatibility score:", err);
            setLoading(false);
        }
    };

    fetchCompatibilityScore();
}, [postId]);

  const saveScoreToDB = async (postId, score) => {
      try {
          await Axios.post("http://localhost:3000/auth/save-compatibility", 
              { postId, score }, 
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          console.log("✅ Score saved successfully!");
      } catch (err) {
          console.error("⚠️ Error saving score:", err);
      }
  };

  const determineMessage = (score) => {
    if (score >= 80) {
      setMessage("🚀 You're an **excellent match**! This job is perfect for you!");
      setEmoji("🎯");
      setProgressColor("#00ff88");
    } else if (score >= 60) {
      setMessage("🔥 You're a **good match**! You have most of the required skills.");
      setEmoji("💪");
      setProgressColor("#ffcc00");
    } else if (score >= 30) {
      setMessage("⚡ You're a **decent match**! A little improvement can boost your chances.");
      setEmoji("🙂");
      setProgressColor("#ff8c00");
    } else {
      setMessage("📚 You need to **improve your skills** for this role.");
      setEmoji("📖");
      setProgressColor("#ff0040");
    }
  };

  return (
    <div className="compatibility-container">
      {confetti && <Confetti />}
      <h1 className="page-title">Job Compatibility Analysis</h1>

      {loading ? (
        <div className="loading-animation">
          <div className="shimmer-text">Analyzing Your Fit...</div>
        </div>
      ) : (
        <div className="result-section">
          <div className="score-box">
            <h2>Your Compatibility Score</h2>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${compatibilityScore}%`, background: progressColor }}
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
