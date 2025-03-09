import React, { useState, useEffect } from "react";
import "../styles/Post.scss";
import ModalComment from "./ModalComment"; // Adjust the path as needed

function Post({ profilePic, username, time, text, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "John Doe", text: "Great post!", pic: "https://via.placeholder.com/32" },
    { id: 2, user: "Jane Smith", text: "Love this!", pic: "https://via.placeholder.com/32" },
  ]);

  // Prevent scrolling when either modal is open
  useEffect(() => {
    if (isModalOpen || isCommentModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isCommentModalOpen]);

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeAnimation("animate-unlike");
    } else {
      setIsLiked(true);
      setLikeAnimation("animate-like");
    }
    // Reset animation after it plays
    setTimeout(() => setLikeAnimation(""), 300);
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
          onClick={() => setIsModalOpen(true)}
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

      {/* Comment modal */}
      <ModalComment
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        profilePic={profilePic}
        username={username}
        time={time}
        text={text}
        image={image}
        comments={comments}
      />
    </div>
  );
}

export default Post;