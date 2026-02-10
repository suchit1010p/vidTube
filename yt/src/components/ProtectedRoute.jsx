// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useCurrentUser } from "../features/auth/auth.hooks";

// const ProtectedRoute = () => {
//   const location = useLocation();
//   const { data: user, isLoading } = useCurrentUser();

//   // Show loading state while checking authentication
//   if (isLoading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh'
//       }}>
//         Loading...
//       </div>
//     );
//   }

//   // If no user after loading, redirect to login
//   if (!user) {
//     return (
//       <Navigate to="/login" replace state={{ from: location.pathname }} />
//     );
//   }

//   // User is authenticated, render protected content
//   return <Outlet />;
// };

// export default ProtectedRoute;



import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../features/auth/auth.hooks";
import { authStorage } from "../utils/authStorage";
import FullPageLoader from "./FullPageLoader";

const ProtectedRoute = () => {
  const location = useLocation();
  const storedUser = authStorage.getUser();

  // Always attempt to fetch the user. 
  // If we have an in-memory token, it uses it.
  // If not (e.g., reload), the interceptor will try to refresh and get a new one.
  const { data: user, isLoading, isError } = useCurrentUser({
    enabled: true, // Always enable to allow refresh flow on reload
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Optimistic UI: If we have a user in storage, assume they are logged in
    // while we validate with the server in the background.
    // initialData structure must match the queryFn response structure because it runs through select
    // queryFn returns AxiosResponse, so we mimic that structure: { data: { data: storedUser } }
    initialData: storedUser ? { data: { data: storedUser } } : undefined,
  });

  if (isLoading) {
    return <FullPageLoader />;
  }

  // If error (401) or no user data, redirect to login
  if (isError || !user) {
    // Only clear if we actually failed. 
    // Usually auth hooks/interceptors clear auth on failure, but safe to do here.
    authStorage.clearAuth();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
