// src/components/Post.jsx
import React, { useState } from "react";
import "../styles/Post.scss";

function Post({ profilePic, username, time, text, image }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "John Doe", text: "Great post!", pic: "https://via.placeholder.com/32" },
    { id: 2, user: "Jane Smith", text: "Love this!", pic: "https://via.placeholder.com/32" },
    { id: 1, user: "John Doe", text: "Great post!", pic: "https://via.placeholder.com/32" },
    { id: 2, user: "Jane Smith", text: "Love this!", pic: "https://via.placeholder.com/32" },
    { id: 1, user: "John Doe", text: "Great post!", pic: "https://via.placeholder.com/32" },
    { id: 2, user: "Jane Smith", text: "Love this!", pic: "https://via.placeholder.com/32" },
    { id: 1, user: "John Doe", text: "Great post!", pic: "https://via.placeholder.com/32" },
    { id: 2, user: "Jane Smith", text: "Love this!", pic: "https://via.placeholder.com/32" },
  ]);

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeAnimation("animate-unlike");
    } else {
      setIsLiked(true);
      setLikeAnimation("animate-like");
    }
    setTimeout(() => setLikeAnimation(""), 300);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        user: "You",
        text: newComment,
        pic: "https://via.placeholder.com/32"
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      // setIsCommentModalOpen(false);
    }
  };

  return (
    <div className="post">
      <div className="post__header">
        <img src={profilePic} alt="User" className="post__pic" />
        <div>
          <span className="post__name">{username}</span>
          <span className="post__time">{time}</span>
        </div>
      </div>
      <p className="post__text">{text}</p>
      {image && (
        <img
          src={image}
          alt="Post content"
          className="post__image"
        />
      )}
      <div className="post__actions">
        <button
          className={`like-button ${isLiked ? "liked" : ""} ${likeAnimation}`}
          onClick={handleLikeClick}
        >
          👍 Like
        </button>
        <button onClick={() => setIsCommentModalOpen(true)}>💬 Comment</button>
        <button>↪ Share</button>
      </div>

      {/* Full-screen Comment Modal */}
      {isCommentModalOpen && (
        <div className="post__comment-modal">
          <div className="post__comment-modal-content">
            {/* Header */}
            <div className="post__comment-modal-header">
              <h2>Comments</h2>
              <button 
                className="post__comment-modal-close"
                onClick={() => setIsCommentModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Original Post Preview */}
            <div className="post__comment-modal-post">
              <div className="post__header">
                <img src={profilePic} alt="User" className="post__pic" />
                <div>
                  <span className="post__name">{username}</span>
                  <span className="post__time">{time}</span>
                </div>
              </div>
              <p className="post__text">{text}</p>
              {image && (
                <img
                  src={image}
                  alt="Post content"
                  className="post__image"
                />
              )}
                          {/* Comments List */}
            <div className="post__comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="post__comment">
                  <img src={comment.pic} alt={comment.user} className="post__comment-pic" />
                  <div className="post__comment-body">
                    <span className="post__comment-user">{comment.user}</span>
                    <p className="post__comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            </div>
            {/* Comment Input */}
            <div className="post__comment-input-area">
              <img 
                src="https://via.placeholder.com/32" 
                alt="Your profile" 
                className="post__comment-pic" 
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="post__comment-textarea"
              />
                          <div className="post__comment-buttons">
              <button onClick={handleCommentSubmit}>Post</button>
            </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Post;