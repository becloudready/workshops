import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./components/Login";
import TraineeHeader from "./components/TraineeHeader";
import TraineeSidebar from "./components/TraineeSidebar";
import TraineeTasks from "./components/TraineeTasks";
import TrainerHeader from "./components/TrainerHeader";
import TrainerSidebar from "./components/TrainerSidebar";
import TrainerTasks from "./components/TrainerTasks";

import { logout, setName as setTraineeName } from "./store/TraineeSlice";
import { setName as setTrainerName } from "./store/TrainerStore";

import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  const dispatch = useDispatch();

  // The "trainee" slice is the single auth session for any logged-in
  // user, manager included - the name is a holdover, not a scoping bug.
  const { accessToken, tokenType, role, isAuthenticated } = useSelector(
    (state) => state.trainee,
  );

  // ============================================================
  // GET /api/auth/me - populate the header/sidebar with the
  // logged-in user's real name instead of the "Test Trainee" /
  // "Test Trainer" placeholder.
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

  function handleLogout() {
    dispatch(logout());
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const isManager = role === "manager";

  return (
    <div className="app-layout">
      {isManager ? <TrainerSidebar onLogout={handleLogout} /> : <TraineeSidebar />}

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
