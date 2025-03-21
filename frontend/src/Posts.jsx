import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../src/Styles.css";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FaRegCommentDots } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3000/api/posts")
      .then((res) => {
        console.log("Received posts:", res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const navigate = useNavigate();

  const handleJobCompatibility = (postId) => {
    navigate(`/job-compatibility/${postId}`);
  };

  const handleLike = async (postId) => {
    try {
      const res = await Axios.put(
        `http://localhost:3000/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
    );
    
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data.likes } : post));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

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
              <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
              <Link className="dropdown-item" to="/upload">Home</Link>
              <Link className="dropdown-item" to="/posts">Posts</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="posts-container">
        {posts.length === 0 ? (
          <p className="no-posts">No posts to show</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post">
              <div className="post-header">
                <span className="post-username">
                  {post.userId?.username || "Anonymous"}'s Post
                </span>
              </div>

              <div className="post-content">
                {post.pdfUrl ? (
                  <iframe 
                    src={`http://localhost:3000/uploads/${post.pdfUrl}`} 
                    width="100%" 
                    height="500px"
                    style={{ border: "none" }}
                  >
                    
                  </iframe>

                ) : (
                  <p>No PDF available</p>
                )}
              </div>
              <div className="post-actions">
                <button onClick={() => handleJobCompatibility(post._id)}>
                  🚀 Job Compatibility
                </button>

                <button className="like-btn" onClick={() => handleLike(post._id)}>
                   <FcLike /> {post.likes?.length || 0}
                </button>

                <button className="comment-btn">
                   <FaRegCommentDots />Comments
                </button>

                <button className="options-btn">
                   <HiDotsVertical />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
