import React, { useEffect, useRef, useState } from "react";
import Post from "./Post";
import "../styles/CenterContent.scss";
import { IoImageOutline, IoClose } from "react-icons/io5"; // Added IoClose for the remove button
import { useSelector } from "react-redux";
import { newPost, getHome } from "../services/postService";
function CenterContent() {
  const postsRef = useRef([]);
  const loaderRef = useRef(null); // Thêm loader để theo dõi khi chạm cuối danh sách
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const token = useSelector((state) => state.user.token);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu hay không


  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const data = await getHome(token, page, 10);
    if (data.data.data.totalPages - 1 === page) {
      setHasMore(false); 
    }
    setPosts((prev) => [...prev, ...data.data.data.content]);
    setLoading(false);
  };

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
      { threshold: 0.1 }
    );
  
    postsRef.current.forEach((post) => {
      if (post) observer.observe(post);
    });
  
    return () => {
      postsRef.current.forEach((post) => {
        if (post) observer.unobserve(post);
      });
    };
  }, [posts]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewPostImage(file);
  };

  // Handle image removal
  const handleImageRemove = () => {
    setNewPostImage(null);
  };


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
                {hasMore && <div ref={loaderRef} className="loading-spinner">Loading...</div>}

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