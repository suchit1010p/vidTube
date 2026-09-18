import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../store/slices/authSlice";
import {
  FaPlayCircle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaImage,
} from "react-icons/fa";
import "./styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setLocalError("");
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.fullName.trim()) {
      setLocalError("Please enter your full name.");
      return;
    }
    if (!form.username.trim()) {
      setLocalError("Please choose a username.");
      return;
    }
    if (!form.email.trim()) {
      setLocalError("Please enter your email.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (!avatar) {
      setLocalError("Please choose a profile avatar image.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName.trim());
    formData.append("username", form.username.trim().toLowerCase());
    formData.append("email", form.email.trim().toLowerCase());
    formData.append("password", form.password);
    formData.append("avatar", avatar);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate("/", { replace: true });
    }
  };

  const displayedError = localError || error;

  return (
    <div className="auth-viewport animate-fade-in">
      <div className="auth-card-box auth-register-card">
        {/* LOGO & HEADING */}
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FaPlayCircle className="auth-logo-icon" />
            <span>VidPlay</span>
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join VidPlay to upload, subscribe, and share</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* AVATAR UPLOAD CIRCLE */}
          <div className="auth-avatar-picker-section">
            <div className="auth-avatar-circle">
              <img
                src={
                  avatarPreview ||
                  "https://api.dicebear.com/7.x/initials/svg?seed=New+Creator"
                }
                alt="Avatar preview"
                className="auth-avatar-preview-img"
              />
              <label htmlFor="regAvatar" className="auth-avatar-badge" title="Upload avatar">
                <FaCamera />
                <input
                  id="regAvatar"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                  required
                />
              </label>
            </div>
            <span className="auth-avatar-label">
              Profile Photo <span style={{ color: "var(--accent-primary)" }}>*</span>
            </span>
          </div>

          {/* NAME FIELDS ROW */}
          <div className="auth-form-row">
            <div className="form-input-group">
              <label className="form-label" htmlFor="regFullName">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
                <input
                  id="regFullName"
                  type="text"
                  name="fullName"
                  className="form-control auth-input-padding"
                  placeholder="e.g. Alex Miller"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-input-group">
              <label className="form-label" htmlFor="regUsername">
                Username
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-at-symbol">@</span>
                <input
                  id="regUsername"
                  type="text"
                  name="username"
                  className="form-control auth-input-padding"
                  placeholder="alexmiller"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-input-group">
            <label className="form-label" htmlFor="regEmail">
              Email
            </label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-input-icon" />
              <input
                id="regEmail"
                type="email"
                name="email"
                className="form-control auth-input-padding"
                placeholder="alex@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="form-input-group">
            <label className="form-label" htmlFor="regPassword">
              Password
            </label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-input-icon" />
              <input
                id="regPassword"
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control auth-input-padding"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
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

          {/* OPTIONAL COVER IMAGE */}
          <div className="form-input-group">
            <label className="form-label" htmlFor="regCover">
              Cover Banner (optional)
            </label>
            <div className="auth-cover-picker">
              <input
                id="regCover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="pv-file-input"
              />
              <label htmlFor="regCover" className="auth-cover-dropzone">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="auth-cover-preview" />
                ) : (
                  <>
                    <FaImage className="auth-cover-icon" />
                    <span>Upload channel header banner</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* ERROR ALERT */}
          {displayedError && (
            <div className="auth-error-alert animate-fade-in">
              {displayedError}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* FOOTER */}
          <div className="auth-card-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-switch-link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
