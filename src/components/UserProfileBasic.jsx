import React from "react";
import "../styles/UserProfileBasic.scss";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";

function UserProfileBasic({
  profilePic = "https://via.placeholder.com/32",
  username = "John Doe",
  userId = "@johndoe",
  friendStatus,
  onFriendAction, // Chỉ sử dụng một prop duy nhất
}) {
  const handleProfileClick = () => {
    // Xử lý sự kiện click vào header (nếu cần)
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
          src={profilePic}
          alt="User profile"
          className="user-profile-basic__pic"
        />
        <div className="user-profile-basic__info">
          <span className="user-profile-basic__name">{username}</span>
          <span className="user-profile-basic__id">{userId}</span>
        </div>
        {renderFriendButton()}
      </div>
    </div>
  );
}

export default UserProfileBasic;