import { NavLink } from "react-router-dom";
import { FaHome, FaList, FaHistory, FaTv } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <NavLink to="/" end className="sidebar-link">
        <FaHome className="icon" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/playlists" className="sidebar-link">
        <FaList className="icon" />
        <span>Playlists</span>
      </NavLink>

      <NavLink to="/liked-videos" className="sidebar-link">
        <AiFillLike className="icon" />
        <span>Liked</span>
      </NavLink>

      <NavLink to="/history" className="sidebar-link">
        <FaHistory className="icon" />
        <span>History</span>
      </NavLink>

      <NavLink to="/dashboard" className="sidebar-link">
        <FaTv className="icon" />
        <span>Dashboard</span>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
