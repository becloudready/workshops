import styles from "./TrainerHeader.module.css";

import { useSelector } from "react-redux";

export default function TrainerHeader() {
  const trainerName = useSelector((state) => state.trainer.name);

  return (
    <div className={styles.trainerHeader}>
      <div className={styles.headerContent}>
        <p className={styles.welcomeLabel}>TRAINER PORTAL</p>

        <h1>
          Welcome to <span>C.B.M.H.</span>
        </h1>

        <p className={styles.trainerName}>
          {trainerName ? `Welcome, ${trainerName}!` : "Welcome!"}
        </p>

        <p className={styles.description}>
          Create tasks, track cohort progress, and see how each trainee is
          doing at a glance.
        </p>
      </div>
    </div>
  );
}
