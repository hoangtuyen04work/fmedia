import React, { useEffect, useRef, useState } from "react";
import Post from "./Post";
import "../styles/CenterContent.scss";
import { IoImageOutline, IoClose } from "react-icons/io5"; // Added IoClose for the remove button
import { useSelector } from "react-redux";
import { newPost } from "../services/postService";
function CenterContent() {
  const postsRef = useRef([]);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const initialPosts = Array.from({ length: 20 }, (_, index) => ({
      avatarLink: "../../public/download.jpg",
      userName: `User ${index + 1}`,
      creationDate: `${index + 1} hrs ago`,
      content: `This is post number ${index + 1}. Enjoying the day!`,
      imageLink: index % 2 === 0 ? "../../public/download.jpg" : null,
      customId: "12312",
      modifiedDate: ""
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
    setNewPostImage(file);
  };

  // Handle image removal
  const handleImageRemove = () => {
    setNewPostImage(null);
  };
  // avaterLink, userName, creationDate, content, imageLink
  // Handle post submission
  const handlePostSubmit = async () => {
    if (newPostText || newPostImage) {
      const newPostData = {
        content: newPostText,
        imageFile: newPostImage,
      };

      const data = await newPost(token, newPostData);
      console.log("data", data);

      setPosts([newPost, ...posts]);
      setNewPostText("");
      setNewPostImage(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="center-content">
      <div className="center-content__feed">
        {/* Create Post Section - Sticky */}
        <div className="center-content__create-post">
          <div
            className="center-content__input-wrapper"
            onClick={() => setIsModalOpen(true)}
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
              avatarLink={post.avatarLink}
              userName={post.userName}
              id={post.id}
              customId={post.customId}
              creationDate={post.creationDate}
              content={post.content}
              imageLink={post.imageLink}
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
              <div className="modal__image-preview-wrapper">
                <img
                  src={newPostImage}
                  alt="Preview"
                  className="modal__image-preview"
                />
                <button
                  onClick={handleImageRemove}
                  className="modal__remove-image"
                >
                  <IoClose />
                </button>
              </div>
            )}
            <div className="modal__actions">
              <label htmlFor="image-upload" className="image-upload">
                <IoImageOutline />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
              <div className="modal__buttons">
                <button onClick={handlePostSubmit}>Post</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterContent;