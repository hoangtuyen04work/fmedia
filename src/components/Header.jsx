import React, { useState } from "react"
import { Navigate, NavLink } from "react-router-dom";
import { doLogout } from "../redux/action/userAction";
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";

// src/components/Header.jsx
import "../styles/Header.scss"

function Header() {
  return (
    <header className="header">
      {/* Left Section: Logo */}
      <div className="header__logo">
        <div className="header__logo-icon">f</div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="header__search">
        <input
          type="text"
          placeholder="Search Facebook"
          className="header__search-input"
        />
      </div>

      {/* Right Section: Icons */}
      <div className="header__icons">
        <div className="header__icon">👤</div>
        <div className="header__icon">🔔</div>
        <div className="header__icon">▼</div>
      </div>
    </header>
  );
}

export default Header;