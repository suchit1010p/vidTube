import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, authLoading } = useSelector((state) => state.auth);

  // Show loading spinner while authentication initialization is in progress
  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "16px",
          color: "var(--text-secondary)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid var(--border-medium)",
            borderTopColor: "var(--accent-primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Verifying session...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login page and preserve intent
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
