import React from "react";
import "../styles/UserProfileBasic.scss";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserProfileBasic({imageLink, userName, customId, userId,  friendship, onFriendAction}) {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate(`/profile?customId=${customId}`);
  };

  const handleFriendActionClick = () => {
    onFriendAction(friendship, userId); // Truyền trạng thái hiện tại
  };

  const renderFriendButton = () => {
    switch (friendship) {
      case "ACCEPTED":
        return (
          <div className="user-profile-basic__friend-status" onClick={handleFriendActionClick}>
            <FaUserCheck />
          </div>
        );
      case "PENDING":
        return (
          <div className="user-profile-basic__friend-status" onClick={handleFriendActionClick}>
            <FaClock />
          </div>
        );
      default:
        return (
          <div className="user-profile-basic__friend-status" onClick={handleFriendActionClick}>
            <FaUserPlus />
          </div>
        );
    }
  };

  return (
    <div className="user-profile-basic">
      <div className="user-profile-basic__header">
        <img
          src={imageLink}
          alt="User profile"
          className="user-profile-basic__pic"
        />
        <div className="user-profile-basic__info"  onClick={handleProfileClick}>
          <span className="user-profile-basic__name">{userName}</span>
          <span className="user-profile-basic__id">{customId}</span>
        </div>
        {renderFriendButton()}
      </div>
    </div>
  );
}

export default UserProfileBasic;