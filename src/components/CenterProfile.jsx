import React, { useState, useEffect, useRef } from "react";
import "../styles/CenterProfile.scss";
import Post from "./Post";
import { useSelector } from "react-redux";
import { getMyProfile } from "../services/userService";
import { getMyPost } from "../services/postService";

function CenterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const postsRef = useRef([]);
  const token = useSelector((state) => state.user.token);
  const [profileData, setProfileData] = useState({});
  const [tempData, setTempData] = useState({ ...profileData });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const size = 10;
  const loaderRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setTempData({
      ...tempData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({
          ...tempData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const newPage = prevPage + 1;
            return newPage;
          });
          if (loaderRef.current) {
            observer.unobserve(loaderRef.current);
          }
        }
      },
      { threshold: 0.1 }
    );
  
    if (loaderRef.current && !loading) {
      observer.observe(loaderRef.current);
    }
  
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]); // Chạy lại khi hasMore hoặc loading thay đổi

  const fetchMyProfile = async () => {
    const data = await getMyProfile(token);
    setProfileData(data.data);
  };

  const fetchMyPost = async (currentPage) => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await getMyPost(token, currentPage, size);
      const newPosts = data.data.data.content;
      if (newPosts.length < size) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    fetchMyPost(page);
  }, [page]);

  return (
    <div className="center-profile">
      {!isEditing ? (
        <div className="profile-display">
          <div className="avatar-container">
            <img src={profileData.imageLink} alt="User avatar" className="avatar" />
          </div>
          <div className="profile-field">
            <span className="label">Bio:</span>
            <span className="value">{profileData.bio}</span>
          </div>
          <div className="profile-field">
            <span className="label">CustomId Id:</span>
            <span className="value">{profileData.customId}</span>
          </div>
          <div className="profile-field">
            <span className="label">User Name:</span>
            <span className="value">{profileData.userName}</span>
          </div>
          <div className="profile-field">
            <span className="label">Email:</span>
            <span className="value">{profileData.email}</span>
          </div>
          <div className="profile-field">
            <span className="label">Phone:</span>
            <span className="value">{profileData.phone}</span>
          </div>
          <div className="profile-field">
            <span className="label">Date of birth:</span>
            <span className="value">{profileData.dob}</span>
          </div>
          <div className="profile-field">
            <span className="label">Creation date:</span>
            <span className="value">{profileData.creationDate}</span>
          </div>
          <div className="profile-field">
            <span className="label">Address:</span>
            <span className="value">{profileData.address}</span>
          </div>
          <button className="edit-btn" onClick={handleEdit}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group avatar-edit">
            <div className="avatar-preview">
              <img src={tempData.avatar} alt="Avatar preview" className="avatar" />
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={tempData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={tempData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={tempData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={tempData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={tempData.dob}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={tempData.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
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
      {hasMore && (
        <div ref={loaderRef} style={{ height: "20px", textAlign: "center" }}>
          {loading && <p>Loading more posts...</p>}
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p style={{ textAlign: "center" }}>No more posts to load.</p>
      )}
    </div>
  );
}

export default CenterProfile;