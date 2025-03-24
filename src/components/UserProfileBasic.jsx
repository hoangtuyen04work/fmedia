import React from "react";
import "../styles/UserProfileBasic.scss";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserProfileBasic({imageLink, userName, customId, userId,  friendStatus, onFriendAction, 
}) {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate(`/profile?customId=${customId}`);
  };

  const handleFriendActionClick = (e) => {
    e.stopPropagation();
    if (onFriendAction) {
      onFriendAction(friendStatus); // Truyền trạng thái hiện tại
    }
  };

  const renderFriendButton = () => {
    switch (friendStatus) {
      case "friends":
        return (
          <div
            className="user-profile-basic__friend-status"
            onClick={handleFriendActionClick}
          >
            <FaUserCheck />
          </div>
        );
      case "pending":
        return (
          <div
            className="user-profile-basic__friend-status"
            onClick={handleFriendActionClick}
          >
            <FaClock />
          </div>
        );
      default:
        return (
          <div
            className="user-profile-basic__friend-status"
            onClick={handleFriendActionClick}
          >
            <FaUserPlus />
          </div>
        );
    }
  };

  return (
    <div className="user-profile-basic">
      <div className="user-profile-basic__header" onClick={handleProfileClick}>
        <img
          src={imageLink}
          alt="User profile"
          className="user-profile-basic__pic"
        />
        <div className="user-profile-basic__info">
          <span className="user-profile-basic__name">{userName}</span>
          <span className="user-profile-basic__id">{customId}</span>
        </div>
        {renderFriendButton()}
      </div>
    </div>
  );
}

export default UserProfileBasic;