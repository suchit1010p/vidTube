import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../store/slices/authSlice";
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
  const [coverImage, setCoverImage] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!avatar) {
      setLocalError("Please select a profile avatar image.");
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
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join the VidPlay community today</p>

        <div className="auth-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="e.g. John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="e.g. johndoe123"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="avatar">Avatar (required)</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setLocalError("");
            }}
            required
            className="file-input"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="coverImage">Cover Image (optional)</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="file-input"
          />
        </div>

        {displayedError && (
          <div className="auth-error" style={{ marginBottom: "16px" }}>
            {displayedError}
          </div>
        )}

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
