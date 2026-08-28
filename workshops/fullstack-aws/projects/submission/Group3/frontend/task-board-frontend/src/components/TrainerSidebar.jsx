import { useSelector } from "react-redux";
import styles from "./TrainerSidebar.module.css";

export default function TrainerSidebar() {
  const trainerName = useSelector((state) => state.trainer.name);

  const initial = trainerName
    ? trainerName.charAt(0).toUpperCase()
    : "T";

  return (
    <aside className={styles.sidebar}>
      {/* Application Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>C</div>

        <div>
          <h2>C.B.M.H.</h2>
          <span>Trainer Portal</span>
        </div>
      </div>

      {/* Trainer Profile */}
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {initial}
        </div>

        <div className={styles.profileInfo}>
          <h3>{trainerName || "Trainer"}</h3>
          <span>Trainer</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={styles.navigation}>
        <p className={styles.sectionTitle}>MANAGEMENT</p>

        <a
          href="/trainer/dashboard"
          className={`${styles.navItem} ${styles.active}`}
        >
          <span className={styles.icon}>⌂</span>
          <span>Dashboard</span>
        </a>

        <a
          href="/trainer/trainees"
          className={styles.navItem}
        >
          <span className={styles.icon}>♙</span>
          <span>Trainees</span>
        </a>

        <a
          href="/trainer/tasks"
          className={styles.navItem}
        >
          <span className={styles.icon}>✓</span>
          <span>Tasks</span>
        </a>

        <a
          href="/trainer/tasks/create"
          className={styles.navItem}
        >
          <span className={styles.icon}>＋</span>
          <span>Create Task</span>
        </a>

        <a
          href="/trainer/progress"
          className={styles.navItem}
        >
          <span className={styles.icon}>◷</span>
          <span>Progress</span>
        </a>
      </nav>

      {/* Bottom Navigation */}
      <div className={styles.bottomNavigation}>
        <a
          href="/trainer/profile"
          className={styles.navItem}
        >
          <span className={styles.icon}>⚙</span>
          <span>Profile</span>
        </a>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => console.log("Trainer logout clicked")}
        >
          <span className={styles.icon}>⇥</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
