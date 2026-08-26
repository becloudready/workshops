import "./App.css";
import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import TellerDashboard from "./pages/TellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/teller" element={<TellerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
