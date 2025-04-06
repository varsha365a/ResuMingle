import React, { useEffect, useState } from "react";
import Axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import "./Styles.css";

const MemberDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    Axios.get("http://localhost:3000/api/posts/company-posts", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await Axios.put(`http://localhost:3000/api/posts/${postId}/like`, {}, { withCredentials: true });
      setPosts(posts.map((post) => post._id === postId ? { ...post, likes: res.data.likes } : post));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const res = await Axios.put(`http://localhost:3000/api/posts/${postId}/dislike`, {}, { withCredentials: true });
      setPosts(posts.map((post) => post._id === postId ? { ...post, dislikes: res.data.dislikes } : post));
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };

  const handleComment = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment) return;

    try {
      const res = await Axios.post(`http://localhost:3000/api/posts/${postId}/comment`,
        { comment },
        { withCredentials: true }
      );

      setPosts(posts.map((post) =>
        post._id === postId ? { ...post, comments: res.data } : post
      ));

      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="member-dashboard-container">
      <h2 className="dashboard-title">📋 Member Dashboard</h2>
      <div className="post-feed">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <strong>{post.userId?.username || "Anonymous"}</strong>
              </div>

              {post.pdfUrl && (
                <div className="post-pdf-preview">
                  <iframe
                    src={`http://localhost:3000/uploads/${post.pdfUrl}`}
                    title="PDF Preview"
                    width="100%"
                    height="150px"
                  />
                </div>
              )}

              <div className="post-comment-section">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                  }
                  className="comment-input"
                />
                <button onClick={() => handleComment(post._id)} className="comment-submit-btn">
                  Post
                </button>
              </div>

              <div className="comment-list">
                {Array.isArray(post.comments) &&
                  post.comments.slice(-3).map((c, i) => (
                    <div key={i} className="single-comment">
                      <strong>{c.userId?.username || "User"}:</strong> {c.comment}
                    </div>
                  ))}
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post._id)} className="action-btn like">
                  <FaThumbsUp /> {post.likes?.length || 0}
                </button>
                <button onClick={() => handleDislike(post._id)} className="action-btn dislike">
                  <FaThumbsDown /> {post.dislikes?.length || 0}
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
