import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import "../styles/Header.scss";
import NotificationDropdown from "./NotificationDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../services/authService";
import { doLogout } from "../redux/action/userAction";

function Header() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState(null); // 'post' or 'user'
  const [searchValue, setSearchValue] = useState(""); // Search input content
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.user.token);

  const handleLogout = () => {
    logout(token);
    dispatch(doLogout());
    navigate("/auth");
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      console.log(`Searching ${searchType}:`, searchValue);
      navigate("/search", {
        state: {
          searchType,
          searchValue,
        },
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUnreadCountChange = (count) => {
    setUnreadCount(count);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-icon" onClick={() => navigate("/")}>
          Media
        </div>
      </div>

      <div className="header__search">
        <div className="header__search-container">
          <input
            type="text"
            placeholder="Search Post"
            className={`header__search-input ${searchType === "post" || (searchValue && searchType !== "user") ? "expanded" : "small"}`}
            onFocus={() => setSearchType("post")}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            value={searchType === "post" ? searchValue : ""}
          />
          <input
            type="text"
            placeholder="Search User"
            className={`header__search-input ${searchType === "user" || (searchValue && searchType !== "post") ? "expanded" : "small"}`}
            onFocus={() => setSearchType("user")}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            value={searchType === "user" ? searchValue : ""}
          />
        </div>

        <button className="header__search-button" onClick={handleSearch}>
          <AiOutlineSearch />
        </button>
      </div>

      <div className="header__icons">
        <div className="header__icon" onClick={() => navigate("/profile")}>
          <CgProfile />
        </div>
        <div className="header__icon notification-icon">
          <NotificationDropdown onUnreadCountChange={handleUnreadCountChange} />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount >= 10 ? "10+" : unreadCount}
            </span>
          )}
        </div>
        <div className="header__icon header__logout" onClick={handleLogout}>
          <IoIosLogOut />
        </div>
      </div>
    </header>
  );
}

export default Header;