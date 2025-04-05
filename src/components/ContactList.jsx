import React from "react";
import "../styles/ContactList.scss";

const getRelativeTime = (sendTime) => {
  if (!sendTime) return "";

  // Parse sendTime (chuỗi ISO-8601)
  const messageTime = new Date(sendTime);

  // Lấy thời gian hiện tại và chuyển về múi giờ Việt Nam (UTC+7)
  const now = new Date();
  const vietnamOffset = 7 * 60; // UTC+7 (7 giờ = 7 * 60 phút)
  const vietnamTime = new Date(now.getTime() + (vietnamOffset - now.getTimezoneOffset()) * 60 * 1000);

  // Tính chênh lệch thời gian
  const diffInMs = vietnamTime - messageTime;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Chuyển đổi sang phút

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày`;
};

function ContactList({ friends, onContactClick }) {
  return (
    <div className="contact-list">
      <h3 className="contact-list__title">Danh bạ</h3>
      <ul className="contact-list__list">
        {friends.map((friend) => (
          <li
            key={friend.userId}
            className="contact-list__item"
            onClick={() => onContactClick(friend)}
          >
            <div className="contact-list__avatar-wrapper">
              {friend.imageLink ? (
                <img
                  src={friend.imageLink}
                  alt={friend.userName}
                  className="contact-list__avatar"
                />
              ) : (
                <span className="contact-list__default-avatar">👤</span>
              )}
              {friend.isOnline && <span className="contact-list__online-dot"></span>}
            </div>
            <div className="contact-list__content">
              <span className="contact-list__name">{friend.userName}</span>
              <div className="contact-list__last-message-wrapper">
                <span className="contact-list__last-message">
                  {friend.newestMessage || "Các bạn hiện đã được kết nối trên Messenger"}
                </span>
                <span className="contact-list__time">
                  {friend.sendTime ? getRelativeTime(friend.sendTime) : ""}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;