import { Link, useNavigate } from "react-router-dom";
import { useLogout, useCurrentUser } from "../features/auth/auth.hooks";
import { FaPlayCircle, FaVideo, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data: user } = useCurrentUser();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate("/login", { replace: true, state: { loggedOut: true } });
      },
    });
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
        <Link to="/publish-video" className="nav-icon-btn" title="Create">
          <FaVideo size={20} />
        </Link>

        {user ? (
          <Link to="/dashboard" className="nav-user-info" title="Dashboard">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="nav-avatar" />
            ) : (
              <FaUserCircle size={28} />
            )}
          </Link>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}

        <button
          className="logout-icon-btn"
          onClick={handleLogout}
          disabled={logoutMutation.isLoading}
          title="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

