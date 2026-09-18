import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaCompass,
  FaPlusCircle,
  FaList,
  FaUser,
} from "react-icons/fa";
import "./mobileNav.css";

const MobileNav = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="mb-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `mb-nav-item ${isActive ? "mb-active" : ""}`}
      >
        <FaHome className="mb-icon" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/?query="
        className={({ isActive }) => `mb-nav-item ${isActive ? "mb-active" : ""}`}
      >
        <FaCompass className="mb-icon" />
        <span>Explore</span>
      </NavLink>

      <NavLink
        to={user ? "/publish-video" : "/login"}
        className={({ isActive }) => `mb-nav-item mb-nav-create ${isActive ? "mb-active" : ""}`}
        aria-label="Upload Video"
      >
        <FaPlusCircle className="mb-icon mb-create-icon" />
      </NavLink>

      <NavLink
        to="/playlists"
        className={({ isActive }) => `mb-nav-item ${isActive ? "mb-active" : ""}`}
      >
        <FaList className="mb-icon" />
        <span>Library</span>
      </NavLink>

      <NavLink
        to={user ? `/channel/${user.username}` : "/login"}
        className={({ isActive }) => `mb-nav-item ${isActive ? "mb-active" : ""}`}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="You" className="mb-avatar-icon" />
        ) : (
          <FaUser className="mb-icon" />
        )}
        <span>{user ? "You" : "Sign In"}</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
