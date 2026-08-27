import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const DEV_BYPASS_AUTH = true; // TEMPORARY - turn off before final testing

function ProtectedRoute({ allowedRoles, children }) {
  const { user, restoring } = useAuth();
  const location = useLocation();

  if (DEV_BYPASS_AUTH) {
    return children;
  }

  if (restoring) {
    return <p>Loading…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
