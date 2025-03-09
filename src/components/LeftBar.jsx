// src/components/LeftBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/LeftBar.scss";

function LeftBar() {
  return (
    <div className="leftbar">
      <ul className="leftbar__list">
        <li className="leftbar__item">
          <Link to="/profile" className="leftbar__link">
            <span className="leftbar__icon">👤</span>
            <span className="leftbar__text">Profile</span>
          </Link>
        </li>
        <li className="leftbar__item">
          <Link to="/friends" className="leftbar__link">
            <span className="leftbar__icon">👥</span>
            <span className="leftbar__text">Friends</span>
          </Link>
        </li>
        <li className="leftbar__item">
          <Link to="/groups" className="leftbar__link">
            <span className="leftbar__icon">👥</span>
            <span className="leftbar__text">Groups</span>
          </Link>
        </li>
        <li className="leftbar__item">
          <Link to="/marketplace" className="leftbar__link">
            <span className="leftbar__icon">🏪</span>
            <span className="leftbar__text">Marketplace</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LeftBar;