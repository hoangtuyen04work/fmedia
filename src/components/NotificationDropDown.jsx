import React, { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import "../styles/NotificationDropdown.scss";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = [
    { id: 1, message: "John liked your post", time: "2m ago" },
    { id: 2, message: "Anna commented on your post", time: "5m ago" },
      { id: 3, message: "Mike started following you", time: "10m ago" },
      { id: 1, message: "John liked your post", time: "2m ago" },
      { id: 2, message: "Anna commented on your post", time: "5m ago" },
      { id: 3, message: "Mike started following you", time: "10m ago" },
      { id: 1, message: "John liked your post", time: "2m ago" },
      { id: 2, message: "Anna commented on your post", time: "5m ago" },
      { id: 3, message: "Mike started following you", time: "10m ago" },
      { id: 1, message: "John liked your post", time: "2m ago" },
      { id: 2, message: "Anna commented on your post", time: "5m ago" },
      { id: 3, message: "Mike started following you", time: "10m ago" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-container")) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notification-container">
      <div className="header__icon" onClick={() => setIsOpen(!isOpen)}>
        <IoIosNotifications />
      </div>
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <p>{notif.message}</p>
                <span>{notif.time}</span>
              </div>
            ))
          ) : (
            <p className="no-notifications">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
