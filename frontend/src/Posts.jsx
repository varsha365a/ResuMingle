import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../src/Styles.css";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get("http://localhost:3000/api/posts")
      .then((res) => {
        console.log("Received posts"); 
        setPosts(res.data);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>📄 ResuMingle</h1>
        <div className="buttons">
          <div className="dropdown">
            <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaUserLarge />
            </button>
            <div className="dropdown-menu">
                <a className="dropdown-item" href="/dashboard">Dashboard</a>
                <a className="dropdown-item" href="/upload">Home</a>
                <a className="dropdown-item" href="/posts">Posts</a>
            </div>
          </div>
        </div>
      </div>
      <div className="posts-container">
        <div className="post-feed">
          {posts.map((post, index) => (
            <div key={index} className="post">
              {/* Header Section */}
              <div className="post-header">
                <span className="post-username">{post.userId.username || "Anonymous"}</span>
              </div>

              {/* PDF Preview Section */}
              <div className="post-content">
                {post.pdfUrl ? (
                  <iframe
                    src={`http://localhost:3000${post.pdfUrl}`}
                    width="100%"
                    height="400px"
                    className="pdf-preview"
                  ></iframe>
                ) : (
                  <p>No PDF available</p>
                )}
              </div>

              {/* Like & Comment Section */}
              <div className="post-actions">
                <button>❤️ Like</button>
                <button>💬 Comment</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Posts;