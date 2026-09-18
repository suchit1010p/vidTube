import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "./FullPageLoader";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, authLoading } = useSelector((state) => state.auth);

  // Show loading spinner while authentication initialization is in progress
  if (authLoading) {
    return <FullPageLoader />;
  }

  // If not authenticated, redirect to login page and preserve intent
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
