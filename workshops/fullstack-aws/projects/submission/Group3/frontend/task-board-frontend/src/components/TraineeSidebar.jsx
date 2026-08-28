import { useSelector } from "react-redux";
import "./TraineeSidebar.css";

const TraineeSidebar = ({ onLogout }) => {
  const traineeName = useSelector((state) => state.trainee.name);

  return (
    <aside className="trainee-sidebar">
      {/* Logo / Application Name */}
      <div className="sidebar-header">
        <h2>Task Board</h2>
      </div>

      {/* Trainee Information */}
      <div className="trainee-profile">
        <div className="trainee-avatar">
          {traineeName?.charAt(0).toUpperCase()}
        </div>

        <div className="trainee-details">
          <h3>{traineeName}</h3>
          <span>Trainee</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        <p className="navigation-title">MENU</p>

        <a href="/trainee/dashboard" className="sidebar-link active">
          <span>▣</span>
          <span>Dashboard</span>
        </a>

        <a href="/trainee/tasks" className="sidebar-link">
          <span>✓</span>
          <span>My Tasks</span>
        </a>

        <a href="/trainee/in-progress" className="sidebar-link">
          <span>◷</span>
          <span>In Progress</span>
        </a>

        <a href="/trainee/completed" className="sidebar-link">
          <span>✓</span>
          <span>Completed</span>
        </a>
      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">
        <a href="/trainee/profile" className="sidebar-link">
          <span>⚙</span>
          <span>Profile</span>
        </a>

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={onLogout}
        >
          <span>⇥</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TraineeSidebar;
