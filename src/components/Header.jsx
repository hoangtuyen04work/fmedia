import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import "../styles/Header.scss";

function Header() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState(null); // 'post' hoặc 'user'
  const [searchValue, setSearchValue] = useState(""); // Nội dung người dùng nhập vào

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      console.log(`Searching ${searchType}:`, searchValue);
      // Thêm logic gọi API tìm kiếm ở đây
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">
      {/* Left Section: Logo */}
      <div className="header__logo">
        <div className="header__logo-icon" onClick={() => navigate("/")}>
          Media
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="header__search">
        <div className="header__search-container">
          {(!searchType || searchType === "post" || searchValue === "") && (
            <input
              type="text"
              placeholder="Search Post"
              className={`header__search-input ${searchType === "post" && searchValue ? "expanded" : ""}`}
              onFocus={() => setSearchType("post")}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              value={searchType === "post" ? searchValue : ""}
            />
          )}
          {(!searchType || searchType === "user" || searchValue === "") && (
            <div className="header__search-divider">|</div>
          )}
          {(!searchType || searchType === "user" || searchValue === "") && (
            <input
              type="text"
              placeholder="Search User"
              className={`header__search-input ${searchType === "user" && searchValue ? "expanded" : ""}`}
              onFocus={() => setSearchType("user")}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              value={searchType === "user" ? searchValue : ""}
            />
          )}
        </div>
        <button className="header__search-button" onClick={handleSearch}>
          <AiOutlineSearch />
        </button>
      </div>

      {/* Right Section: Icons */}
      <div className="header__icons">
        <div className="header__icon" onClick={() => navigate("/profile")}>
          <CgProfile />
        </div>
        <div className="header__icon">🔔</div>
        <div className="header__icon header__logout">
          <IoIosLogOut />
        </div>
      </div>
    </header>
  );
}

export default Header;
