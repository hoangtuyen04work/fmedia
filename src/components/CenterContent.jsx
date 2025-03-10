// src/components/CenterContent.jsx
import React, { useEffect, useRef, useState } from "react";
import Post from "./Post";
import "../styles/CenterContent.scss";

function CenterContent() {
  const postsRef = useRef([]); // Reference to track posts
  const [posts, setPosts] = useState([]); // State to manage posts dynamically
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [newPostText, setNewPostText] = useState(""); // State for new post text
  const [newPostImage, setNewPostImage] = useState(null); // State for new post image

  // Initial sample posts
  useEffect(() => {
    const initialPosts = Array.from({ length: 20 }, (_, index) => ({
      profilePic: "../../public/download.jpg",
      username: `User ${index + 1}`,
      time: `${index + 1} hrs ago`,
      text: `This is post number ${index + 1}. Enjoying the day!`,
      image: index % 2 === 0 ? "../../public/download.jpg" : null,
    }));
    setPosts(initialPosts);
  }, []);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    postsRef.current.forEach((post) => {
      if (post) observer.observe(post);
    });

    return () => observer.disconnect();
  }, [posts]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      setNewPostImage(imageUrl);
    }
  };

  // Handle post submission
  const handlePostSubmit = () => {
    if (newPostText || newPostImage) {
      const newPost = {
        profilePic: "https://via.placeholder.com/36",
        username: "You",
        time: "Just now",
        text: newPostText,
        image: newPostImage,
      };
      setPosts([newPost, ...posts]); // Add new post to the top
      setNewPostText(""); // Reset text
      setNewPostImage(null); // Reset image
      setIsModalOpen(false); // Close modal
    }
  };

  return (
    <div className="center-content">
      <div className="center-content__feed">
        {/* Create Post Section - Sticky */}
        <div className="center-content__create-post">
          <div
            className="center-content__input-wrapper"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            <img
              src="https://via.placeholder.com/36"
              alt="Profile"
              className="center-content__profile-pic"
            />
            <div className="center-content__input">What's on your mind?</div>
          </div>
          <div className="center-content__options">
            <button className="center-content__option">📷 Photo/Video</button>
            <button className="center-content__option">😊 Feeling/Activity</button>
          </div>
        </div>

        {/* Posts with animation */}
        {posts.map((post, index) => (
          <div
            key={index}
            ref={(el) => (postsRef.current[index] = el)}
            className="scroll-animation"
          >
            <Post
              profilePic={post.profilePic}
              username={post.username}
              time={post.time}
              text={post.text}
              image={post.image}
            />
          </div>
        ))}
      </div>

      {/* Modal for creating a new post */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <h2>Create Post</h2>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind?"
              className="modal__textarea"
            />
            {newPostImage && (
              <img
                src={newPostImage}
                alt="Preview"
                className="modal__image-preview"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="modal__file-input"
            />
            <div className="modal__buttons">
              <button onClick={handlePostSubmit}>Post</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterContent;