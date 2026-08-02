import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import UserBoard from "./pages/UserBoard";
import AdminBoard from "./pages/AdminBoard";

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <h1>Noticeboard</h1>
        <nav>
          <NavLink to="/" end>Board</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<UserBoard />} />
          <Route path="/admin" element={<AdminBoard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
