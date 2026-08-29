import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TraineeTasks.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

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
  const [detailLoading, setDetailLoading] = useState(false);

  const [subtaskLoading, setSubtaskLoading] = useState({});
  const [progressSubmitting, setProgressSubmitting] = useState(false);

  const [error, setError] = useState(null);

  const [progressComment, setProgressComment] = useState("");

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
  // Handle API responses
  // ============================================================

  async function handleResponse(response, defaultMessage) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
      let message = defaultMessage;

      try {
        const errorData = await response.json();

        if (typeof errorData?.detail === "string") {
          message = errorData.detail;
        } else if (typeof errorData?.message === "string") {
          message = errorData.message;
        }
      } catch {
        // Response wasn't JSON.
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return null;
  }

  // ============================================================
  // Calculate percentage from subtasks
  //
  // Example:
  //
  // 0 / 3 = 0%
  // 1 / 3 = 33%
  // 2 / 3 = 67%
  // 3 / 3 = 100%
  // ============================================================

  function calculateProgress(subtasks = []) {
    if (!subtasks.length) {
      return 0;
    }

    const completedCount = subtasks.filter(
      (subtask) => subtask.isCompleted,
    ).length;

    return Math.round((completedCount / subtasks.length) * 100);
  }

  // ============================================================
  // GET /student/tasks
  // ============================================================

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated || !accessToken) {
          throw new Error("You are not logged in.");
        }

        const response = await fetch(`${API_BASE_URL}/student/tasks`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const data = await handleResponse(
          response,
          `Failed to fetch tasks: ${response.status}`,
        );

        setTasks(Array.isArray(data) ? data : []);
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
  // GET /student/tasks/{task_id}
  // ============================================================

  async function fetchTask(taskId) {
    try {
      setDetailLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/student/tasks/${taskId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(
        response,
        `Failed to fetch task: ${response.status}`,
      );

      setSelectedTask(data);

      // The percentage is calculated from the subtasks.
      // We intentionally don't use an editable percentage.
      await fetchProgressHistory(taskId);
    } catch (error) {
      console.error("Error fetching task:", error);

      setError(error instanceof Error ? error.message : "Unable to load task.");
    } finally {
      setDetailLoading(false);
    }
  }

  // ============================================================
  // Open / close task
  // ============================================================

  function handleTaskClick(taskId) {
    // Clicking the open task closes it.
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setProgressHistory([]);
      setProgressComment("");
      setError(null);

      return;
    }

    fetchTask(taskId);
  }

  // ============================================================
  // GET /student/tasks/{task_id}/progress/history
  // ============================================================

  async function fetchProgressHistory(taskId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/student/tasks/${taskId}/progress/history`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const data = await handleResponse(
        response,
        `Failed to fetch progress history: ${response.status}`,
      );

      setProgressHistory(Array.isArray(data) ? data : []);
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
  // POST /student/tasks/{task_id}/progress
  //
  // Percentage is calculated automatically from subtasks.
  // The trainee only supplies an optional comment.
  // ============================================================

  async function submitProgress(task, percentage, comment = null) {
    if (!task?.id) {
      return;
    }

    try {
      setProgressSubmitting(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/student/tasks/${task.id}/progress`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            percentage,
            comment: comment?.trim() || null,
          }),
        },
      );

      await handleResponse(
        response,
        `Failed to submit progress: ${response.status}`,
      );

      // Refresh progress history so the new entry appears.
      await fetchProgressHistory(task.id);

      setProgressComment("");
    } catch (error) {
      console.error("Error submitting progress:", error);

      setError(
        error instanceof Error ? error.message : "Unable to submit progress.",
      );
    } finally {
      setProgressSubmitting(false);
    }
  }

  // ============================================================
  // PATCH /student/subtasks/{subtask_id}
  //
  // Clicking a checkbox immediately sends:
  //
  // {
  //   "isCompleted": true/false
  // }
  //
  // Then we calculate the new percentage from the subtasks.
  // ============================================================

  async function handleSubtaskToggle(subtask) {
    if (!selectedTask) {
      return;
    }

    const subtaskId = subtask.id;

    if (subtaskLoading[subtaskId]) {
      return;
    }

    const newCompletedState = !subtask.isCompleted;

    try {
      setError(null);

      setSubtaskLoading((current) => ({
        ...current,
        [subtaskId]: true,
      }));

      // ----------------------------------------------------------
      // PATCH the subtask
      // ----------------------------------------------------------

      const response = await fetch(
        `${API_BASE_URL}/student/subtasks/${subtaskId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            isCompleted: newCompletedState,
          }),
        },
      );

      await handleResponse(
        response,
        `Failed to update subtask: ${response.status}`,
      );

      // ----------------------------------------------------------
      // Refresh the task from the backend
      // ----------------------------------------------------------

      const taskResponse = await fetch(
        `${API_BASE_URL}/student/tasks/${selectedTask.id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const updatedTask = await handleResponse(
        taskResponse,
        `Failed to refresh task: ${taskResponse.status}`,
      );

      setSelectedTask(updatedTask);

      // ----------------------------------------------------------
      // Calculate progress from subtasks
      // ----------------------------------------------------------

      const calculatedPercentage = calculateProgress(updatedTask.subtasks);

      // ----------------------------------------------------------
      // Update the task card in the list
      // ----------------------------------------------------------

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.taskId === selectedTask.id
            ? {
                ...task,
                currentPercentage: calculatedPercentage,
                subtaskSummary: `${
                  updatedTask.subtasks.filter((item) => item.isCompleted).length
                }/${updatedTask.subtasks.length} completed`,
              }
            : task,
        ),
      );

      // ----------------------------------------------------------
      // Submit calculated progress to the backend
      //
      // We don't ask the trainee for a percentage.
      // ----------------------------------------------------------

      await submitProgress(updatedTask, calculatedPercentage, null);
    } catch (error) {
      console.error("Error updating subtask:", error);

      setError(
        error instanceof Error ? error.message : "Unable to update subtask.",
      );
    } finally {
      setSubtaskLoading((current) => {
        const next = { ...current };
        delete next[subtaskId];
        return next;
      });
    }
  }

  // ============================================================
  // Submit an optional progress comment
  //
  // Percentage is still calculated from subtasks.
  // ============================================================

  async function handleProgressCommentSubmit(event) {
    event.preventDefault();

    if (!selectedTask) {
      return;
    }

    const percentage = calculateProgress(selectedTask.subtasks);

    await submitProgress(selectedTask, percentage, progressComment);
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
  // Initial error
  // ============================================================

  if (error && !selectedTask) {
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
          ERROR
      ====================================================== */}

      {error && selectedTask && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

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
          tasks.map((task) => {
            const isOpen = selectedTask?.id === task.taskId;

            const progress = isOpen
              ? calculateProgress(selectedTask.subtasks)
              : (task.currentPercentage ?? 0);

            return (
              <div
                key={task.taskId}
                className={`${styles.taskCard} ${
                  isOpen ? styles.taskCardOpen : ""
                }`}
              >
                {/* ==================================================
                    TASK SUMMARY
                    ================================================== */}

                <button
                  type="button"
                  className={styles.taskCardButton}
                  onClick={() => handleTaskClick(task.taskId)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.taskCardHeader}>
                    <div className={styles.taskTitleWrapper}>
                      <h3>{task.title || `Task ${task.taskId}`}</h3>

                      <span
                        className={`${styles.expandIndicator} ${
                          isOpen ? styles.expandIndicatorOpen : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>

                    {task.urgency && (
                      <span className={styles.statusBadge}>{task.urgency}</span>
                    )}
                  </div>

                  <div className={styles.taskMeta}>
                    {task.dueDate && (
                      <span>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}

                    <span>Progress: {progress}%</span>

                    {task.subtaskSummary && <span>{task.subtaskSummary}</span>}
                  </div>

                  {/* Progress bar */}

                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressBarFill}
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </button>

                {/* ==================================================
                    EXPANDABLE DETAILS
                    ================================================== */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.taskDetails}
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        height: {
                          duration: 0.3,
                          ease: "easeInOut",
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <div className={styles.taskDetailsInner}>
                        {detailLoading ? (
                          <div className={styles.status}>
                            <p>Loading task...</p>
                          </div>
                        ) : (
                          <>
                            {/* ----------------------------------------
                                Description
                                ---------------------------------------- */}

                            {selectedTask.description && (
                              <div className={styles.descriptionSection}>
                                <p className={styles.sectionLabel}>
                                  Description
                                </p>

                                <p className={styles.description}>
                                  {selectedTask.description}
                                </p>
                              </div>
                            )}

                            {/* ----------------------------------------
                                Task information
                                ---------------------------------------- */}

                            <div className={styles.taskInfoGrid}>
                              {selectedTask.dueDate && (
                                <div className={styles.taskInfo}>
                                  <span className={styles.infoLabel}>
                                    Due Date
                                  </span>

                                  <strong>
                                    {new Date(
                                      selectedTask.dueDate,
                                    ).toLocaleDateString()}
                                  </strong>
                                </div>
                              )}

                              <div className={styles.taskInfo}>
                                <span className={styles.infoLabel}>
                                  Completion
                                </span>

                                <strong>{progress}%</strong>
                              </div>
                            </div>

                            {/* ----------------------------------------
                                Progress bar
                                ---------------------------------------- */}

                            <div className={styles.progressSection}>
                              <div className={styles.progressHeader}>
                                <span>Task Completion</span>

                                <strong>{progress}%</strong>
                              </div>

                              <div className={styles.largeProgressBar}>
                                <motion.div
                                  className={styles.progressBarFill}
                                  initial={false}
                                  animate={{
                                    width: `${progress}%`,
                                  }}
                                  transition={{
                                    duration: 0.4,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>

                            {/* ----------------------------------------
                                Subtasks
                                ---------------------------------------- */}

                            {selectedTask.subtasks &&
                              selectedTask.subtasks.length > 0 && (
                                <div className={styles.subtasks}>
                                  <div className={styles.subtaskHeader}>
                                    <h3>Subtasks</h3>

                                    <span>
                                      {
                                        selectedTask.subtasks.filter(
                                          (subtask) => subtask.isCompleted,
                                        ).length
                                      }{" "}
                                      / {selectedTask.subtasks.length}
                                    </span>
                                  </div>

                                  <div className={styles.subtaskList}>
                                    {selectedTask.subtasks.map((subtask) => {
                                      const isUpdating =
                                        subtaskLoading[subtask.id];

                                      return (
                                        <label
                                          key={subtask.id}
                                          className={`${styles.subtask} ${
                                            subtask.isCompleted
                                              ? styles.subtaskCompleted
                                              : ""
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={Boolean(
                                              subtask.isCompleted,
                                            )}
                                            disabled={isUpdating}
                                            onChange={() =>
                                              handleSubtaskToggle(subtask)
                                            }
                                          />

                                          <span>
                                            {subtask.title ||
                                              `Subtask ${subtask.id}`}
                                          </span>

                                          {isUpdating && (
                                            <small>Saving...</small>
                                          )}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                            {/* ----------------------------------------
                                No subtasks
                                ---------------------------------------- */}

                            {(!selectedTask.subtasks ||
                              selectedTask.subtasks.length === 0) && (
                              <div className={styles.noSubtasks}>
                                <p>This task doesn't have any subtasks yet.</p>
                              </div>
                            )}

                            {/* ----------------------------------------
                                Progress comment
                                ---------------------------------------- */}

                            <div className={styles.progressSection}>
                              <div className={styles.progressHeader}>
                                <div>
                                  <h3>Progress Update</h3>

                                  <p>
                                    Completion is automatically calculated from
                                    your subtasks.
                                  </p>
                                </div>

                                <strong className={styles.progressPercentage}>
                                  {progress}%
                                </strong>
                              </div>

                              <form
                                onSubmit={handleProgressCommentSubmit}
                                className={styles.progressForm}
                              >
                                <textarea
                                  value={progressComment}
                                  onChange={(event) =>
                                    setProgressComment(event.target.value)
                                  }
                                  placeholder="Add an optional comment..."
                                  rows={3}
                                  disabled={progressSubmitting}
                                />

                                <button
                                  type="submit"
                                  disabled={
                                    progressSubmitting ||
                                    !progressComment.trim()
                                  }
                                >
                                  {progressSubmitting
                                    ? "Saving..."
                                    : "Add Progress Update"}
                                </button>
                              </form>
                            </div>

                            {/* ----------------------------------------
                                Progress history
                                ---------------------------------------- */}

                            <div className={styles.progressHistory}>
                              <div className={styles.historyHeader}>
                                <h3>Progress History</h3>
                              </div>

                              {progressHistory.length === 0 ? (
                                <p className={styles.noHistory}>
                                  No progress updates yet.
                                </p>
                              ) : (
                                <div className={styles.progressList}>
                                  {progressHistory.map((update, index) => (
                                    <div
                                      key={`${update.createdAt}-${index}`}
                                      className={styles.progressItem}
                                    >
                                      <div
                                        className={
                                          styles.progressItemPercentage
                                        }
                                      >
                                        {update.percentage}%
                                      </div>

                                      <div
                                        className={styles.progressItemContent}
                                      >
                                        {update.comment && (
                                          <span>{update.comment}</span>
                                        )}

                                        <small>
                                          {new Date(
                                            update.createdAt,
                                          ).toLocaleString()}
                                        </small>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
