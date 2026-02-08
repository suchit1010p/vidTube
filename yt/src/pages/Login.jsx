import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../features/auth/auth.hooks";
import { authStorage } from "../utils/authStorage";
import "./styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if already logged in - instant, no API call
  useEffect(() => {
    const hasToken = authStorage.getAccessToken();
    const user = authStorage.getUser();
    
    // If we have both token and user in storage, redirect immediately
    if (hasToken && user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          const redirectTo = location.state?.from || "/";
          navigate(redirectTo, { replace: true });
        },
      }
    );
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your VidPlay account</p>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {loginMutation.isError && (
          <div className="auth-error">
            {loginMutation.error?.response?.data?.message ||
              "Login failed. Please check your credentials."}
          </div>
        )}

        <button
          type="submit"
          className="auth-btn"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Sign In"}
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
