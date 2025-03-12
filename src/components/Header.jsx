import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import "../styles/Header.scss";
import NotificationDropdown from "./NotificationDropDown";
function Header() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState(null); // 'post' hoặc 'user'
  const [searchValue, setSearchValue] = useState(""); // Nội dung người dùng nhập vào

  const handleLogout = () => {
    navigate("/auth")
  }
  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      console.log(`Searching ${searchType}:`, searchValue);
      navigate("/search", { 
        state: { 
          searchType, 
          searchValue 
        } 
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
          {/* Ô tìm kiếm Post */}
          <input
            type="text"
            placeholder="Search Post"
            className={`header__search-input ${searchType === "post" || (searchValue && searchType !== "user") ? "expanded" : "small"}`}
            onFocus={() => setSearchType("post")}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            value={searchType === "post" ? searchValue : ""}
          />



          {/* Ô tìm kiếm User */}
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
  <NotificationDropdown />
  <div className="header__icon header__logout" onClick={handleLogout}>
    <IoIosLogOut />
  </div>
</div>
    </header>
  );
}

export default Header;
