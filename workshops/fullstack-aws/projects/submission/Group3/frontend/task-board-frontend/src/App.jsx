import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./components/Login";

import TraineeHeader from "./components/Trainee/TraineeHeader";
import TraineeSidebar from "./components/Trainee/TraineeSidebar";
import TraineeTasks from "./components/Trainee/TraineeTasks";

import TrainerHeader from "./components/Trainer/TrainerHeader";
import TrainerSidebar from "./components/Trainer/TrainerSidebar";
import TrainerTasks from "./components/Trainer/TrainerTasks";
import TrainerCohorts from "./components/Trainer/TrainerCohorts";
import TrainerTrainees from "./components/Trainer/TrainerTrainees";

import { logout, setName as setTraineeName } from "./store/TraineeSlice";
import { setName as setTrainerName } from "./store/TrainerSlice";

import useTheme from "./hooks/useTheme";

import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function App() {
  const dispatch = useDispatch();

  // ============================================================
  // Authentication
  // ============================================================

  const { accessToken, tokenType, role, isAuthenticated } = useSelector(
    (state) => state.trainee,
  );

  // ============================================================
  // Theme (light/dark) - shared regardless of role, toggled from
  // whichever sidebar is showing
  // ============================================================

  const { theme, toggleTheme } = useTheme();

  // ============================================================
  // Trainer navigation
  // ============================================================

  const trainerTab = useSelector((state) => state.trainer.tab);

  // ============================================================
  // GET /api/auth/me
  // ============================================================

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    async function fetchProfile() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `${tokenType || "Bearer"} ${accessToken}`,
          },
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
  }, [isAuthenticated, accessToken, tokenType, dispatch]);

  // ============================================================
  // Logout
  // ============================================================

  function handleLogout() {
    dispatch(logout());
  }

  // ============================================================
  // Login
  // ============================================================

  if (!isAuthenticated) {
    return <Login />;
  }

  // ============================================================
  // Determine role
  // ============================================================

  const isManager = role === "manager";

  // ============================================================
  // Trainer content
  // ============================================================

  function renderTrainerContent() {
    switch (trainerTab) {
      case "cohorts":
        return <TrainerCohorts />;

      case "trainees":
        return <TrainerTrainees />;

      case "tasks":
        return <TrainerTasks />;

      default:
        return <TrainerCohorts />;
    }
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="app-layout">
      {isManager ? (
        <TrainerSidebar
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <TraineeSidebar theme={theme} onToggleTheme={toggleTheme} />
      )}

      <div className="app-main">
        {isManager ? <TrainerHeader /> : <TraineeHeader />}

        <main className="main-content">
          {isManager ? renderTrainerContent() : <TraineeTasks />}
        </main>
      </div>
    </div>
  );
}

export default App;
