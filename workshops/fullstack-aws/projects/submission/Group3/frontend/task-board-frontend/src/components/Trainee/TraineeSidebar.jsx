import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/TraineeSlice";
import ProfileModal from "../ProfileModal";
import "./TraineeSidebar.css";

const TraineeSidebar = ({ theme, onToggleTheme }) => {
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);

  const trainee = useSelector((state) => state.trainee);

  const traineeName = trainee.name;
  const traineeRole = trainee.role;

  function handleLogout() {
    dispatch(logout());

    // Send the user back to login
    window.location.href = "/login";
  }

  // Use name if available, otherwise use a temporary fallback
  const displayName = traineeName || "Trainee";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside className="trainee-sidebar">
      {/* Logo / Application Name */}

      <div className="sidebar-header">
        <h2>Task Board</h2>
      </div>

      {/* Trainee Information */}

      <div className="trainee-profile">
        <div className="trainee-avatar">{avatarLetter}</div>

        <div className="trainee-details">
          <h3>{displayName}</h3>

          <span>
            {traineeRole
              ? traineeRole.charAt(0).toUpperCase() + traineeRole.slice(1)
              : "Trainee"}
          </span>
        </div>
      </div>

      {/* Navigation */}

      <nav className="sidebar-navigation">
        <p className="navigation-title">MENU</p>

        <a href="/trainee/dashboard" className="sidebar-link active">
          <span>▣</span>
          <span>Dashboard</span>
        </a>
      </nav>

      {/* Bottom Navigation */}

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-link"
          onClick={() => setProfileOpen(true)}
        >
          <span>⚙</span>
          <span>Profile Settings</span>
        </button>

        <button
          type="button"
          className="sidebar-link"
          onClick={onToggleTheme}
        >
          <span>{theme === "dark" ? "☀" : "☾"}</span>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <span>⇥</span>
          <span>Logout</span>
        </button>
      </div>

      {profileOpen && (
        <ProfileModal onClose={() => setProfileOpen(false)} />
      )}
    </aside>
  );
};

export default TraineeSidebar;
