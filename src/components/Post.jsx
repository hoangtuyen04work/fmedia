import React, { useState, useEffect } from "react";
import "../styles/Post.scss";

function Post({ profilePic, username, time, text, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
    // Cleanup on unmount or when modal closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

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
          onClick={() => setIsModalOpen(true)} // Open modal when clicked
        />
      )}
      <div className="post__actions">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↪ Share</button>
      </div>

      {/* Full-size image modal */}
      {isModalOpen && (
        <div className="post__modal" onClick={() => setIsModalOpen(false)}>
          <div className="post__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="post__modal-close" onClick={() => setIsModalOpen(false)}>
              ✖
            </button>
            <img src={image} alt="Full Size" className="post__modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;