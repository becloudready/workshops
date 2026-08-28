import { useEffect, useState } from "react";
import styles from "./TraineeTasks.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export default function TraineeTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // GET /api/student/tasks
  // ============================================================

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("You are not logged in.");
        }

        const response = await fetch(`${API_BASE_URL}/student/tasks`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }

        const data = await response.json();

        setTasks(data);
      } catch (error) {
        console.error("Error fetching trainee tasks:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // ============================================================
  // GET /api/student/tasks/{task_id}
  // ============================================================

  async function fetchTask(taskId) {
    try {
      setError(null);
      setSelectedTask(null);
      setProgressHistory([]);

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_BASE_URL}/student/tasks/${taskId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch task: ${response.status}`);
      }

      const data = await response.json();

      setSelectedTask(data);

      await fetchProgressHistory(taskId);
    } catch (error) {
      console.error("Error fetching task:", error);

      setError(error.message);
    }
  }

  // ============================================================
  // GET /api/student/tasks/{task_id}/progress/history
  // ============================================================

  async function fetchProgressHistory(taskId) {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/student/tasks/${taskId}/progress/history`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch progress history: ${response.status}`);
      }

      const data = await response.json();

      setProgressHistory(data);
    } catch (error) {
      console.error("Error fetching progress history:", error);

      setError(error.message);
    }
  }

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className={styles.status}>
        <p>Loading trainee tasks...</p>
      </div>
    );
  }

  // ============================================================
  // Error
  // ============================================================

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Unable to load tasks</h2>

        <p>{error}</p>
      </div>
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className={styles.container}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className={styles.header}>
        <div>
          <p className={styles.label}>TRAINEE TASK BOARD</p>

          <h2>My Tasks</h2>
        </div>

        <p className={styles.taskCount}>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {/* ======================================================
          TASK LIST
      ====================================================== */}

      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            <h3>No tasks assigned</h3>

            <p>You currently don't have any tasks to complete.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <button
              key={task.id}
              className={styles.taskCard}
              onClick={() => fetchTask(task.id)}
            >
              <div className={styles.taskCardHeader}>
                <h3>{task.title || `Task ${task.id}`}</h3>

                {task.status && (
                  <span className={styles.statusBadge}>{task.status}</span>
                )}
              </div>

              {task.description && (
                <p className={styles.description}>{task.description}</p>
              )}

              <div className={styles.taskMeta}>
                {task.due_date && <span>Due: {task.due_date}</span>}

                {task.progress !== undefined && task.progress !== null && (
                  <span>Progress: {task.progress}%</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* ======================================================
          SELECTED TASK
      ====================================================== */}

      {selectedTask && (
        <div className={styles.selectedTask}>
          <div className={styles.selectedHeader}>
            <div>
              <p className={styles.label}>TASK DETAILS</p>

              <h2>{selectedTask.title || `Task ${selectedTask.id}`}</h2>
            </div>

            {selectedTask.status && (
              <span className={styles.statusBadge}>{selectedTask.status}</span>
            )}
          </div>

          {/* Description */}

          {selectedTask.description && (
            <p className={styles.description}>{selectedTask.description}</p>
          )}

          {/* Due Date */}

          {selectedTask.due_date && (
            <div className={styles.taskInfo}>
              <strong>Due Date</strong>

              <span>{selectedTask.due_date}</span>
            </div>
          )}

          {/* Progress */}

          {selectedTask.progress !== undefined &&
            selectedTask.progress !== null && (
              <div className={styles.taskInfo}>
                <strong>Progress</strong>

                <span>{selectedTask.progress}%</span>
              </div>
            )}

          {/* ==================================================
              SUBTASKS
          ================================================== */}

          {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
            <div className={styles.subtasks}>
              <h3>Subtasks</h3>

              {selectedTask.subtasks.map((subtask) => (
                <div key={subtask.id} className={styles.subtask}>
                  <input
                    type="checkbox"
                    checked={subtask.is_completed || false}
                    readOnly
                  />

                  <span>
                    {subtask.title || subtask.name || `Subtask ${subtask.id}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ==================================================
              PROGRESS HISTORY
          ================================================== */}

          <div className={styles.progress}>
            <h3>Progress History</h3>

            {progressHistory.length === 0 ? (
              <p>No progress updates yet.</p>
            ) : (
              <div className={styles.progressList}>
                {progressHistory.map((update, index) => (
                  <div key={update.id || index} className={styles.progressItem}>
                    <strong>{update.percentage}%</strong>

                    {update.comment && <span>{update.comment}</span>}

                    {update.created_at && <small>{update.created_at}</small>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
