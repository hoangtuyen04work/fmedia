import React, { useState, useEffect, useRef } from "react";
import "../styles/CenterProfile.scss";
import Post from "./Post";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyProfile, getUserProfileByCustomId } from "../services/userService";
import { getMyPost, getUserPosts } from "../services/postService";
import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, unfriend } from "../services/friendService";

function CenterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const postsRef = useRef([]);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.user);
  const [profileData, setProfileData] = useState({});
  const [tempData, setTempData] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const size = 10;
  const loaderRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search); // Sửa ở đây
  const customId = searchParams.get("customId");
  const isOwnProfile = !customId || customId === currentUser?.customId;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          const data = await getMyProfile(token);
          setProfileData(data.data);
          setTempData(data.data);
        } else {
          const data = await getUserProfileByCustomId(token, customId);
          setProfileData(data.data);
          setFriendStatus(data.data.friendStatus);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/profile");
      }
    };
    fetchProfile();
  }, [token, customId, isOwnProfile, searchParams]);

// Reset posts and fetch new posts when customId or isOwnProfile changes
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setLoading(false);

    const fetchPosts = async (currentPage) => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const data = isOwnProfile
          ? await getMyPost(token, currentPage, size)
          : await getUserPosts(token, customId, currentPage, size);
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
    fetchPosts(0); // Fetch page 0 immediately when profile changes
  }, [token, customId, isOwnProfile]); // Dependency array includes customId and isOwnProfile
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
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  const handleFriendAction = async (action) => {
    try {
      switch (action) {
        case "add":
          await sendFriendRequest(token, customId);
          setFriendStatus("requested");
          break;
        case "cancel":
          await cancelFriendRequest(token, customId);
          setFriendStatus(null);
          break;
        case "accept":
          await acceptFriendRequest(token, customId);
          setFriendStatus("friends");
          break;
        case "unfriend":
          await unfriend(token, customId);
          setFriendStatus(null);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Friend action failed:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...tempData });
    setIsEditing(false);
    // TODO: Gọi API để update profile nếu cần
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
          imageLink: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFriendButton = () => {
    if (isOwnProfile) return null;

    switch (friendStatus) {
      case "friends":
        return (
          <button className="friend-btn unfriend" onClick={() => handleFriendAction("unfriend")}>
            Unfriend
          </button>
        );
      case "pending":
        return (
          <button className="friend-btn accept" onClick={() => handleFriendAction("accept")}>
            Accept Friend Request
          </button>
        );
      case "requested":
        return (
          <button className="friend-btn cancel" onClick={() => handleFriendAction("cancel")}>
            Cancel Request
          </button>
        );
      default:
        return (
          <button className="friend-btn add" onClick={() => handleFriendAction("add")}>
            Add Friend
          </button>
        );
    }
  };

  const renderProfileContent = () => {
    if (isOwnProfile && isEditing) {
      return (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group avatar-edit">
            <div className="avatar-preview">
              <img src={tempData.imageLink} alt="Avatar preview" className="avatar" />
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
            <textarea id="bio" name="bio" value={tempData.bio || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={tempData.userName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={tempData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={tempData.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={tempData.dob || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={tempData.address || ""}
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
      );
    }

    return (
      <div className="profile-display">
        <div className="avatar-container">
          <img src={profileData.imageLink} alt="User avatar" className="avatar" />
        </div>
        <div className="profile-field">
          <span className="label">Bio:</span>
          <span className="value">{profileData.bio}</span>
        </div>
        <div className="profile-field">
          <span className="label">CustomId:</span>
          <span className="value">{profileData.customId}</span>
        </div>
        <div className="profile-field">
          <span className="label">User Name:</span>
          <span className="value">{profileData.userName}</span>
        </div>
        {isOwnProfile && (
          <>
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
          </>
        )}
        {renderFriendButton()}
      </div>
    );
  };

  return (
    <div className="center-profile">
      {renderProfileContent()}
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