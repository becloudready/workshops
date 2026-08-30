import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTab } from "../../store/TrainerSlice";
import ProfileModal from "../ProfileModal";
import styles from "./TrainerSidebar.module.css";

export default function TrainerSidebar({ onLogout, theme, onToggleTheme }) {
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);

  const { name: trainerName, tab } = useSelector((state) => state.trainer);

  const displayName = trainerName || "Trainer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      {/* Logo / Application Name */}

      <div className={styles.header}>
        <h2>Task Board</h2>
      </div>

      {/* Trainer Information */}

      <div className={styles.profile}>
        <div className={styles.avatar}>{initial}</div>

        <div className={styles.details}>
          <h3>{displayName}</h3>
          <span>Trainer</span>
        </div>
      </div>

      {/* Navigation */}

      <nav className={styles.navigation}>
        <p className={styles.navigationTitle}>MENU</p>

        <button
          type="button"
          className={`${styles.link} ${tab === "cohorts" ? styles.active : ""}`}
          onClick={() => dispatch(setTab("cohorts"))}
        >
          <span>▣</span>
          <span>Cohorts</span>
        </button>

        <button
          type="button"
          className={`${styles.link} ${
            tab === "trainees" ? styles.active : ""
          }`}
          onClick={() => dispatch(setTab("trainees"))}
        >
          <span>♙</span>
          <span>Trainees</span>
        </button>
      </nav>

      {/* Bottom Navigation */}

      <div className={styles.bottom}>
        <button
          type="button"
          className={styles.link}
          onClick={() => setProfileOpen(true)}
        >
          <span>⚙</span>
          <span>Profile Settings</span>
        </button>

        <button type="button" className={styles.link} onClick={onToggleTheme}>
          <span>{theme === "dark" ? "☀" : "☾"}</span>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          type="button"
          className={`${styles.link} ${styles.logoutButton}`}
          onClick={onLogout}
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
}
