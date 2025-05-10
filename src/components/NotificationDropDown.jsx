import React, { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import "../styles/NotificationDropdown.scss";
import { getNotification, readNotification } from "../services/notificationService";
import { useSelector } from "react-redux";

// Utility to format timestamp to relative time (e.g., "2m ago")
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationDropdown = ({ onUnreadCountChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);
  const pageSize = 10;

  const fetchNotifications = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotification(token, pageNumber, pageSize);
      const { content, totalPages, pageNumber: currentPage } = response.data.data;
      setNotifications((prev) =>
        pageNumber === 0 ? content : [...prev, ...content]
      );
      setTotalPages(totalPages);
      setPage(pageNumber);
      // Calculate unread count
      const newUnreadCount = content.filter((notif) => !notif.read).length;
      setUnreadCount((prev) => (pageNumber === 0 ? newUnreadCount : prev + newUnreadCount));
      onUnreadCountChange((prev) => (pageNumber === 0 ? newUnreadCount : prev + newUnreadCount));
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    if (unreadCount === 0) return; // Skip API call if no unread notifications
    try {
      await readNotification(token);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      onUnreadCountChange(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  // Fetch notifications on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchNotifications(0);
    }
  }, [token]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-container")) {
        setIsOpen(false);
        markNotificationsAsRead(); // Mark notifications as read when closing dropdown
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleToggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      if (token) {
        fetchNotifications(0); // Fetch fresh notifications when opening dropdown
      }
    } else {
      markNotificationsAsRead(); // Mark notifications as read when closing dropdown
    }
  };

  const handleLoadMore = () => {
    if (page + 1 < totalPages) {
      fetchNotifications(page + 1);
    }
  };

  return (
    <div className="notification-container">
      <div className="header__icon" onClick={handleToggleDropdown}>
        <IoIosNotifications />
      </div>
      {isOpen && (
        <div className="notification-dropdown">
          {loading && notifications.length === 0 && (
            <p className="loading">Loading...</p>
          )}
          {error && <p className="error">{error}</p>}
          {notifications.length > 0 ? (
            <>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.read ? "read" : "unread"}`}
                >
                  <p>{notif.content || notif.title || "No content"}</p>
                  <span>{formatRelativeTime(notif.createdAt)}</span>
                </div>
              ))}
              {page + 1 < totalPages && (
                <button
                  className="load-more"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          ) : !loading && !error ? (
            <p className="no-notifications">No new notifications</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;