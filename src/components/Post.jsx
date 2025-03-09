// src/components/Post.jsx
import React from "react";
import "../styles/Post.scss"; // You can create a separate SCSS file or reuse styles

function Post({ profilePic, username, time, text, image }) {
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
      {image && <img src={image} alt="Post content" className="post__image" />}
      <div className="post__actions">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↪ Share</button>
      </div>
    </div>
  );
}

export default Post;