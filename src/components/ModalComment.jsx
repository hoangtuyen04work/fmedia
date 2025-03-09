import React, { useState, useEffect } from "react";
import "../styles/ModalComment.scss";

const ModalComment = ({ isOpen, onClose, profilePic, username, time, text, image, comments }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`post__modal ${isOpen ? "active" : ""}`} 
      onClick={onClose}
    >
      <div 
        className="post__modal-content"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="post__comment-modal-header">
          <span>Comments</span>
          <button 
            className="post__comment-modal-close" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="post__comment-post">
          <div className="post__header">
            <img src={profilePic} alt="User" className="post__pic" />
            <div>
              <span className="post__name">{username}</span>
              <span className="post__time">{time}</span>
            </div>
          </div>
          <p className="post__text">{text}</p>
          {image && (
            <img src={image} alt="Post content" className="post__image" />
          )}
        </div>

        <div className="post__comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="post__comment-item">
              <img src={comment.pic} alt={comment.user} />
              <div>
                <strong>{comment.user}</strong> {comment.text}
              </div>
            </div>
          ))}
        </div>

        <form className="post__comment-input" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default ModalComment;