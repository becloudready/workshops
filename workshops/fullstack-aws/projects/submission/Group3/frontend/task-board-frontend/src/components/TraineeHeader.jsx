import styles from "./TraineeHeader.module.css";

import { useSelector } from "react-redux";

export default function TraineeHeader() {
  const trainee = useSelector((state) => state.trainee);

  const traineeName = trainee.name;
  const userId = trainee.userId;

  return (
    <div className={styles.traineeHeader}>
      <div className={styles.headerContent}>
        <p className={styles.welcomeLabel}>NEW TRAINEE</p>

        <h1>
          Welcome to <span>C.B.M.H.</span>
        </h1>

        <p className={styles.traineeName}>
          {traineeName
            ? `Welcome, ${traineeName}!`
            : userId
              ? `Welcome, Trainee #${userId}!`
              : "Welcome!"}
        </p>

        <p className={styles.description}>
          Your trainee task board is ready. View your tasks, track your
          progress, and stay organized throughout your training.
        </p>
      </div>
    </div>
  );
}
