import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Login from "./components/Login";
import TraineeHeader from "./components/TraineeHeader";
import TraineeSidebar from "./components/TraineeSidebar";
import TraineeTasks from "./components/TraineeTasks";
import TrainerHeader from "./components/TrainerHeader";
import TrainerSidebar from "./components/TrainerSidebar";
import TrainerTasks from "./components/TrainerTasks";

import { setName as setTraineeName } from "./store/TraineeStore";
import { setName as setTrainerName } from "./store/TrainerStore";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token"),
  );
  const [role, setRole] = useState(localStorage.getItem("role"));

  // ============================================================
  // GET /api/auth/me - populate the header/sidebar with the
  // logged-in user's real name instead of the "Test Trainee" /
  // "Test Trainer" placeholder.
  // ============================================================

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchProfile() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.role === "manager") {
          dispatch(setTrainerName(data.fullName));
        } else {
          dispatch(setTraineeName(data.fullName));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, [isLoggedIn, dispatch]);

  function handleLogin() {
    setIsLoggedIn(true);
    setRole(localStorage.getItem("role"));
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");

    setIsLoggedIn(false);
    setRole(null);
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const isManager = role === "manager";

  return (
    <div className="app-layout">
      {isManager ? (
        <TrainerSidebar onLogout={handleLogout} />
      ) : (
        <TraineeSidebar onLogout={handleLogout} />
      )}

      <div className="app-main">
        {isManager ? <TrainerHeader /> : <TraineeHeader />}

        <main className="main-content">
          {isManager ? <TrainerTasks /> : <TraineeTasks />}
        </main>
      </div>
    </div>
  );
}

export default App;