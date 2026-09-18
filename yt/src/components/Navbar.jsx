import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  FaPlayCircle,
  FaSearch,
  FaTimes,
  FaVideo,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaUser,
  FaTv,
  FaList,
  FaHeart,
} from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Theme state: default dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("vidplay_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vidplay_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync search input if URL has ?query=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) {
      setSearchTerm(query);
    } else if (location.pathname !== "/") {
      // Don't wipe if on other pages
    }
  }, [location.search, location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/?query=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    navigate("/");
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="nb-header">
      {/* LEFT: LOGO */}
      <div className="nb-left">
        <Link to="/" className="nb-logo" aria-label="VidPlay Home">
          <div className="nb-logo-icon-wrapper">
            <FaPlayCircle className="nb-logo-icon" />
          </div>
          <span className="nb-logo-text">
            Vid<span>Play</span>
          </span>
        </Link>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="nb-center">
        <form className="nb-search-form" onSubmit={handleSearchSubmit}>
          <div className="nb-search-input-wrapper">
            <FaSearch className="nb-search-icon" />
            <input
              type="text"
              className="nb-search-input"
              placeholder="Search videos, creators, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="nb-search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button type="submit" className="nb-search-submit-btn" aria-label="Submit search">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="nb-right">
        {/* Theme Toggle Button */}
        <button
          className="nb-icon-btn nb-theme-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FaSun className="nb-sun-icon" /> : <FaMoon />}
        </button>

        {user ? (
          <>
            {/* Create Video Button */}
            <Link to="/publish-video" className="btn btn-primary nb-create-btn">
              <FaVideo size={14} />
              <span>Create</span>
            </Link>

            {/* User Dropdown */}
            <div className="nb-user-menu-wrapper" ref={userMenuRef}>
              <button
                className="nb-user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || "User"}`
                  }
                  alt={user.username || "profile"}
                  className="nb-avatar"
                />
              </button>

              {showUserMenu && (
                <div className="nb-dropdown-menu animate-fade-in">
                  <div className="nb-dropdown-header">
                    <img
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || "User"}`
                      }
                      alt={user.username}
                      className="nb-dropdown-avatar"
                    />
                    <div className="nb-dropdown-user-meta">
                      <strong>{user.fullName}</strong>
                      <span>@{user.username}</span>
                    </div>
                  </div>

                  <div className="nb-dropdown-divider" />

                  <Link
                    to={`/channel/${user.username}`}
                    className="nb-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="nb-dropdown-item-icon" />
                    <span>Your Channel</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="nb-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaTv className="nb-dropdown-item-icon" />
                    <span>Creator Studio</span>
                  </Link>

                  <Link
                    to="/playlists"
                    className="nb-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaList className="nb-dropdown-item-icon" />
                    <span>Playlists</span>
                  </Link>

                  <Link
                    to="/liked-videos"
                    className="nb-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaHeart className="nb-dropdown-item-icon" />
                    <span>Liked Videos</span>
                  </Link>

                  <div className="nb-dropdown-divider" />

                  <button
                    className="nb-dropdown-item nb-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="nb-dropdown-item-icon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="nb-guest-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
