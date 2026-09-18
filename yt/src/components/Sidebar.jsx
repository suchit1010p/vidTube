import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaList,
  FaHistory,
  FaHeart,
  FaTv,
  FaCloudUploadAlt,
  FaCompass,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="sb-sidebar">
      {/* SECTION 1: DISCOVER */}
      <div className="sb-group">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
        >
          <FaHome className="sb-icon" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/?query="
          className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
        >
          <FaCompass className="sb-icon" />
          <span>Explore</span>
        </NavLink>
      </div>

      <div className="sb-divider" />

      {/* SECTION 2: LIBRARY */}
      <div className="sb-group">
        <div className="sb-section-title">LIBRARY</div>

        <NavLink
          to="/playlists"
          className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
        >
          <FaList className="sb-icon" />
          <span>Playlists</span>
        </NavLink>

        <NavLink
          to="/liked-videos"
          className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
        >
          <FaHeart className="sb-icon" />
          <span>Liked Videos</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
        >
          <FaHistory className="sb-icon" />
          <span>History</span>
        </NavLink>
      </div>

      {user && (
        <>
          <div className="sb-divider" />

          {/* SECTION 3: CREATOR */}
          <div className="sb-group">
            <div className="sb-section-title">CREATOR STUDIO</div>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
            >
              <FaTv className="sb-icon" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/publish-video"
              className={({ isActive }) => `sb-link ${isActive ? "sb-link-active" : ""}`}
            >
              <FaCloudUploadAlt className="sb-icon" />
              <span>Upload Video</span>
            </NavLink>
          </div>
        </>
      )}

      {/* FOOTER METADATA */}
      <div className="sb-footer">
        <p>© 2026 VidPlay Inc.</p>
        <p>Stream & Share</p>
      </div>
    </aside>
  );
};

export default Sidebar;
