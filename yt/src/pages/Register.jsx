import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../features/auth/auth.hooks";
import { authStorage } from "../utils/authStorage";
import "./styles/auth.css";

import { uploadFileToS3 } from "../utils/s3.upload";

const Register = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Check if already logged in - instant, no API call
  useEffect(() => {
    const hasToken = authStorage.getAccessToken();
    const user = authStorage.getUser();

    if (hasToken && user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || registerMutation.isPending) return;

    if (!avatar) {
      alert("Avatar is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images to S3
      console.log("Uploading avatar to S3...");
      const avatarUrl = await uploadFileToS3(avatar, "avatar");
      if (!avatarUrl) throw new Error("Avatar upload failed");

      let coverImageUrl = "";
      if (coverImage) {
        console.log("Uploading cover image to S3...");
        coverImageUrl = await uploadFileToS3(coverImage, "cover-image");
      }

      // 2. Prepare data for backend
      // Note: We are now sending JSON, not FormData, because we are sending URLs
      const data = {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        avatar: avatarUrl,
        coverImage: coverImageUrl
      };

      registerMutation.mutate(data, {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });

    } catch (error) {
      console.error("Registration flow failed:", error);
      alert("Failed to upload images or register. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join the community today</p>

        <div className="auth-field">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="e.g. John Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="e.g. johndoe123"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label>Avatar (required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
            className="file-input"
          />
        </div>

        <div className="auth-field">
          <label>Cover Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="file-input"
          />
        </div>

        {registerMutation.isError && (
          <div className="auth-error">
            {registerMutation.error?.response?.data?.message ||
              "Registration failed. Please try again."}
          </div>
        )}

        <button
          type="submit"
          className="auth-btn"
          disabled={registerMutation.isPending || isSubmitting}
        >
          {registerMutation.isPending || isSubmitting ? "Creating account..." : "Sign Up"}
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
