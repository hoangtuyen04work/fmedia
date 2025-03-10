// src/components/CenterProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/CenterProfile.scss";
import Post from "./Post";
function CenterProfile() {
    const [isEditing, setIsEditing] = useState(false);
      const [posts, setPosts] = useState([]); // State to manage posts dynamically
      const postsRef = useRef([]); // Reference to track posts
    
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Web Developer",
    location: "New York",
    avatar: "../../public/download.jpg",
    userId: "tunsdsd23",
      phone: "0123123123",
      dob: "12/12/2002",
    creationDate: "23/12/2024"
  });
  const [tempData, setTempData] = useState({ ...profileData });

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
    const initialPosts = Array.from({ length: 20 }, (_, index) => ({
      profilePic: "../../public/download.jpg",
      username: `User ${index + 1}`,
      time: `${index + 1} hrs ago`,
      text: `This is post number ${index + 1}. Enjoying the day!`,
      image: index % 2 === 0 ? "../../public/download.jpg" : null,
      
    }));
    setPosts(initialPosts);
  }, []);

  return (
    <div className="center-profile">
      {!isEditing ? (
        <div className="profile-display">
          <div className="avatar-container">
            <img src={profileData.avatar} alt="User avatar" className="avatar" />
                  </div>
                  <div className="profile-field">
            <span className="label">Bio:</span>
            <span className="value">{profileData.bio}</span>
          </div>
          <div className="profile-field">
            <span className="label">User Id:</span>
            <span className="value">{profileData.userId}</span>
          </div>        
          <div className="profile-field">
            <span className="label">Name:</span>
            <span className="value">{profileData.name}</span>
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
            <span className="label">Location:</span>
            <span className="value">{profileData.location}</span>
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
              profilePic={post.profilePic}
              username={post.username}
              time={post.time}
              text={post.text}
              image={post.image}
            />
          </div>
        ))}
    </div>
  );
}

export default CenterProfile;