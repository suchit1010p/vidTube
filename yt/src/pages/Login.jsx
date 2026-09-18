import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/slices/authSlice";
import { FaPlayCircle, FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import "./styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    const resultAction = await dispatch(login({ email: email.trim(), password }));
    if (login.fulfilled.match(resultAction)) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="auth-viewport animate-fade-in">
      <div className="auth-card-box">
        {/* LOGO & HEADING */}
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FaPlayCircle className="auth-logo-icon" />
            <span>VidPlay</span>
          </Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue watching and sharing</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* EMAIL */}
          <div className="form-input-group">
            <label className="form-label" htmlFor="loginEmail">
              Email or Username
            </label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
              <input
                id="loginEmail"
                type="text"
                className="form-control auth-input-padding"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="form-input-group">
            <label className="form-label" htmlFor="loginPassword">
              Password
            </label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                className="form-control auth-input-padding"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="auth-error-alert animate-fade-in">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading || !email.trim() || !password}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* FOOTER */}
          <div className="auth-card-footer">
            <span>Don&rsquo;t have an account?</span>
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
