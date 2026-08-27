<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
=======
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import TellerDashboard from "./pages/TellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function AppRoutes() {
  const { user, restoring } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teller"
        element={
          <ProtectedRoute allowedRoles={["teller"]}>
            <TellerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          restoring ? (
            <p>Loading…</p>
          ) : user ? (
            <Navigate to={`/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
>>>>>>> main
}

<<<<<<< HEAD
export default App;
=======
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
>>>>>>> main
