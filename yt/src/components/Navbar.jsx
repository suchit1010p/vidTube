import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { FaPlayCircle, FaVideo, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <FaPlayCircle className="logo-icon" />
          <span>VidPlay</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/publish-video" className="nav-icon-btn" title="Create Video">
              <FaVideo size={20} />
            </Link>

            <Link to="/dashboard" className="nav-user-info" title="Dashboard">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="nav-avatar" />
              ) : (
                <FaUserCircle size={28} />
              )}
            </Link>

            <button
              className="logout-icon-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
          </>
        ) : (
          <div className="nav-auth-actions">
            <Link to="/login" className="login-link">
              Sign In
            </Link>
            <Link to="/register" className="register-link" style={{ marginLeft: "12px" }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
