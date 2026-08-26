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

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import CustomerDashboard from "./pages/CustomerDashboard";
import TellerDashboard from "./pages/TellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/teller" element={<TellerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
>>>>>>> main
}

export default App;