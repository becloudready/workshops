import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TraineeTasks.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function TraineeTasks() {
  // ============================================================
  // Redux authentication
  // ============================================================

  const { accessToken, tokenType, userId, role, isAuthenticated } = useSelector(
    (state) => state.trainee,
  );

  // ============================================================
  // Local state
  // ============================================================

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // Authentication headers
  // ============================================================

  function getAuthHeaders() {
    if (!accessToken) {
      throw new Error("You are not logged in.");
    }

    return {
      Authorization: `${tokenType || "Bearer"} ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  // ============================================================
  // GET /api/student/tasks
  // ============================================================

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);

        // Make sure Redux has authentication information
        if (!isAuthenticated || !accessToken) {
          throw new Error("You are not logged in.");
        }

        console.log("========== FETCHING TRAINEE TASKS ==========");
        console.log("User ID:", userId);
        console.log("Role:", role);
        console.log("Token available:", !!accessToken);
        console.log("=============================================");

        const response = await fetch(`${API_BASE_URL}/student/tasks`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        console.log("Tasks response status:", response.status);

        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }

        const data = await response.json();

        console.log("Trainee tasks response:", data);

        setTasks(data);
      } catch (error) {
        console.error("Error fetching trainee tasks:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load tasks.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [accessToken, tokenType, userId, role, isAuthenticated]);

  // ============================================================
  // GET /api/student/tasks/{task_id}
  // ============================================================

  async function fetchTask(taskId) {
    try {
      setError(null);
      setSelectedTask(null);
      setProgressHistory([]);

      if (!isAuthenticated || !accessToken) {
        throw new Error("You are not logged in.");
      }

      console.log("Fetching task:", taskId);

      const response = await fetch(`${API_BASE_URL}/student/tasks/${taskId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      console.log("Task response status:", response.status);

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch task: ${response.status}`);
      }

      const data = await response.json();

      console.log("Task response:", data);

      setSelectedTask(data);

      await fetchProgressHistory(taskId);
    } catch (error) {
      console.error("Error fetching task:", error);

      setError(error instanceof Error ? error.message : "Unable to load task.");
    }
  }

  // ============================================================
  // GET /api/student/tasks/{task_id}/progress/history
  // ============================================================

  async function fetchProgressHistory(taskId) {
    try {
      if (!isAuthenticated || !accessToken) {
        throw new Error("You are not logged in.");
      }

      console.log("Fetching progress history for task:", taskId);

      const response = await fetch(
        `${API_BASE_URL}/student/tasks/${taskId}/progress/history`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      console.log("Progress history response status:", response.status);

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch progress history: ${response.status}`);
      }

      const data = await response.json();

      console.log("Progress history response:", data);

      setProgressHistory(data);
    } catch (error) {
      console.error("Error fetching progress history:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load progress history.",
      );
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
              key={task.taskId}
              className={styles.taskCard}
              onClick={() => fetchTask(task.taskId)}
            >
              <div className={styles.taskCardHeader}>
                <h3>{task.title || `Task ${task.taskId}`}</h3>

                {task.urgency && (
                  <span className={styles.statusBadge}>{task.urgency}</span>
                )}
              </div>

              <div className={styles.taskMeta}>
                {task.dueDate && <span>Due: {task.dueDate}</span>}

                {task.currentPercentage !== undefined &&
                  task.currentPercentage !== null && (
                    <span>Progress: {task.currentPercentage}%</span>
                  )}

                {task.subtaskSummary && <span>{task.subtaskSummary}</span>}
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

            {selectedTask.urgency && (
              <span className={styles.statusBadge}>{selectedTask.urgency}</span>
            )}
          </div>

          {/* Description */}

          {selectedTask.description && (
            <p className={styles.description}>{selectedTask.description}</p>
          )}

          {/* Due Date */}

          {selectedTask.dueDate && (
            <div className={styles.taskInfo}>
              <strong>Due Date</strong>

              <span>{selectedTask.dueDate}</span>
            </div>
          )}

          {/* Progress */}

          {selectedTask.currentPercentage !== undefined &&
            selectedTask.currentPercentage !== null && (
              <div className={styles.taskInfo}>
                <strong>Progress</strong>

                <span>{selectedTask.currentPercentage}%</span>
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
                    checked={subtask.isCompleted || false}
                    readOnly
                  />

                  <span>{subtask.title || `Subtask ${subtask.id}`}</span>
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

                    {update.createdAt && <small>{update.createdAt}</small>}
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
