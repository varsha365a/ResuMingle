import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../src/Styles.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { FaRegCommentDots } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3000/api/posts")
      .then((res) => {
        console.log("Received posts:", res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleLogout = () => {
    Axios.get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
        }
      })
      .catch((err) => console.error("Error logging out:", err));
  };

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

      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: res.data.likes } : post)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    console.log("Attempting to delete post with ID:", postId); // Debugging

    const confirmDelete = window.confirm("Are you sure you want to delete your post?");

    if (confirmDelete) {
        try {
            const response = await Axios.delete(`http://localhost:3000/api/posts/${postId}`);
            console.log("Delete response:", response.data);

            setPosts(posts.filter(post => post._id !== postId));

            navigate("/upload");
        } catch (err) {
            console.error("Error deleting post:", err);
        }
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
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
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
                  />
                ) : (
                  <p>No PDF available</p>
                )}
              </div>
              <div className="post-actions">
                <button onClick={() => handleJobCompatibility(post._id)}>Job Compatibility</button>
                <button className="like-btn" onClick={() => handleLike(post._id)}>
                  <FcLike /> {post.likes?.length || 0}
                </button>
                <button className="comment-btn">
                  <FaRegCommentDots /> Comments
                </button>

                {/* Options Dropdown */}
                <div className="dropdown">
                  <button className="options-btn btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <HiDotsVertical />
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item text-danger" onClick={() => handleDeletePost(post._id)}>
                        Delete Post
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
