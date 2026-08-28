import { useState } from "react";

import Login from "./components/Login";
import TraineeHeader from "./components/TraineeHeader";
import TraineeSidebar from "./components/TraineeSidebar";
import TraineeTasks from "./components/TraineeTasks";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token"),
  );

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");

    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <TraineeSidebar onLogout={handleLogout} />

      <div className="app-main">
        <TraineeHeader />

        <main className="main-content">
          <TraineeTasks />
        </main>
      </div>
    </div>
  );
}

export default App;