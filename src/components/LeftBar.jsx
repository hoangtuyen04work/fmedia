import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LeftBar.scss";

function LeftBar() {
  const [showFriendsSubmenu, setShowFriendsSubmenu] = useState(false);

  const handleMouseEnter = () => {
    console.log("Mouse entered Friends item");
    setShowFriendsSubmenu(true);
  };

  const handleMouseLeave = () => {
    console.log("Mouse left Friends item");
    setShowFriendsSubmenu(false);
  };

  const handleClick = () => {
    console.log("Clicked Friends item");
    setShowFriendsSubmenu((prev) => !prev);
  };

  return (
    <div className="leftbar">
      <ul className="leftbar__list">
        <li className="leftbar__item">
          <Link to="/profile" className="leftbar__link">
            <span className="leftbar__icon">👤</span>
            <span className="leftbar__text">Hồ sơ</span>
          </Link>
        </li>
        <li
          className="leftbar__item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="leftbar__link" onClick={handleClick}>
            <span className="leftbar__icon">👥</span>
            <span className="leftbar__text">Bạn bè</span>
          </div>
          {showFriendsSubmenu && (
            <ul className="leftbar__submenu">
              <li className="leftbar__item leftbar__submenu-item">
                <Link to="/friends/requests" className="leftbar__link">
                  <span className="leftbar__icon">📩</span>
                  <span className="leftbar__text">Lời mời kết bạn</span>
                </Link>
              </li>
              <li className="leftbar__item leftbar__submenu-item">
                <Link to="/friends/list" className="leftbar__link">
                  <span className="leftbar__icon">👥</span>
                  <span className="leftbar__text">Danh sách bạn bè</span>
                </Link>
              </li>
              <li className="leftbar__item leftbar__submenu-item">
                <Link to="/friends/sent-requests" className="leftbar__link">
                  <span className="leftbar__icon">📤</span>
                  <span className="leftbar__text">Lời mời đã gửi</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="leftbar__item">
          <Link to="/groups" className="leftbar__link">
            <span className="leftbar__icon">👥</span>
            <span className="leftbar__text">Nhóm</span>
          </Link>
        </li>
        <li className="leftbar__item">
          <Link to="/marketplace" className="leftbar__link">
            <span className="leftbar__icon">🏪</span>
            <span className="leftbar__text">Chợ</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LeftBar;