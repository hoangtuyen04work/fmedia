// src/components/UserProfileBasic.jsx
import React from "react";
import "../styles/UserProfileBasic.scss";

function UserProfileBasic({ 
  profilePic = "https://via.placeholder.com/32", 
  username = "John Doe", 
  userId = "@johndoe" 
}) {
    const handleProfileClick = () => {
        
    }
  return (
    <div className="user-profile-basic">
      <div className="user-profile-basic__header" onClick={handleProfileClick}>
        <img 
          src={profilePic} 
          alt="User profile" 
                  className="user-profile-basic__pic" 
                  
        />
        <div className="user-profile-basic__info">
          <span className="user-profile-basic__name">{username}</span>
          <span className="user-profile-basic__id">{userId}</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfileBasic;