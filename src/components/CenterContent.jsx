// src/components/CenterContent.jsx
import React from "react";
import Post from "./Post";
import "../styles/CenterContent.scss";

function CenterContent() {
  // Sample post data (simulating a large number of posts)
  const posts = Array.from({ length: 20 }, (_, index) => ({
    profilePic: "https://via.placeholder.com/36",
    username: `User ${index + 1}`,
    time: `${index + 1} hrs ago`,
    text: `This is post number ${index + 1}. Enjoying the day!`,
    image: index % 2 === 0 ? "https://via.placeholder.com/500x300" : null,
  }));

  return (
    <div className="center-content">
      <div className="center-content__feed">
        {/* Create Post Section - Now inside the feed */}
        <div className="center-content__create-post">
          <div className="center-content__input-wrapper">
            <img
              src="https://via.placeholder.com/36"
              alt="Profile"
              className="center-content__profile-pic"
            />
            <input
              type="text"
              placeholder="What's on your mind?"
              className="center-content__input"
            />
          </div>
          <div className="center-content__options">
            <button className="center-content__option">📷 Photo/Video</button>
            <button className="center-content__option">😊 Feeling/Activity</button>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post, index) => (
          <Post
            key={index}
            profilePic={post.profilePic}
            username={post.username}
            time={post.time}
            text={post.text}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
}

export default CenterContent;