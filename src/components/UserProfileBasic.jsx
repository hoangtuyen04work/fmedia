import React from "react";
import "../styles/UserProfileBasic.scss";
import { useNavigate } from "react-router-dom";

function UserProfileBasic({ imageLink, userName, customId, userId, friendship, onFriendAction }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile?customId=${customId}`);
  };

  const handleFriendActionClick = (action) => {
    onFriendAction(friendship, userId, action); // Truyền thêm action để xử lý
  };

  const renderFriendButton = () => {
    switch (friendship) {
      case "ACCEPTED":
        return (
          <button
            className="user-profile-basic__friend-button user-profile-basic__friend-button--cancel"
            onClick={() => handleFriendActionClick("CANCEL")}
          >
            Hủy bạn bè
          </button>
        );
      case "PENDING":
        return (
          <button
            className="user-profile-basic__friend-button user-profile-basic__friend-button--cancel"
            onClick={() => handleFriendActionClick("CANCEL")}
          >
            Hủy lời mời
          </button>
        );
      case "WAITING":
        return (
          <div className="user-profile-basic__friend-actions">
            <button
              className="user-profile-basic__friend-button user-profile-basic__friend-button--accept"
              onClick={() => handleFriendActionClick("ACCEPT")}
            >
              Xác nhận
            </button>
            <button
              className="user-profile-basic__friend-button user-profile-basic__friend-button--cancel"
              onClick={() => handleFriendActionClick("CANCEL")}
            >
              Xóa
            </button>
          </div>
        );
      default:
        return (
          <button
            className="user-profile-basic__friend-button user-profile-basic__friend-button--add"
            onClick={() => handleFriendActionClick("ADD")}
          >
            Thêm bạn
          </button>
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
        <div className="user-profile-basic__info" onClick={handleProfileClick}>
          <span className="user-profile-basic__name">{userName}</span>
          <span className="user-profile-basic__id">{customId}</span>
        </div>
        {renderFriendButton()}
      </div>
    </div>
  );
}

export default UserProfileBasic;