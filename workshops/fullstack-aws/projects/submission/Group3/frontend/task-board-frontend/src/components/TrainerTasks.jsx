import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TrainerTasks.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const URGENCY_OPTIONS = ["low", "medium", "high", "urgent"];

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  urgency: "medium",
  cohortId: "",
  subtasks: [""],
};

export default function TrainerTasks() {
  // The "trainee" slice holds the current auth session for any
  // logged-in user, manager included - see the note in App.jsx.
  const { accessToken, tokenType } = useSelector((state) => state.trainee);

  function getAuthHeaders(withJson = false) {
    if (!accessToken) {
      throw new Error("You are not logged in.");
    }

    const headers = {
      Authorization: `${tokenType || "Bearer"} ${accessToken}`,
    };

    if (withJson) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const [selectedTraineeId, setSelectedTraineeId] = useState(null);
  const [traineeDetail, setTraineeDetail] = useState(null);
  const [traineeLoading, setTraineeLoading] = useState(false);

  // ============================================================
  // GET /api/manager/tasks
  // ============================================================

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/manager/tasks`, {
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
    } catch (err) {
      console.error("Error fetching manager tasks:", err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // ============================================================
  // Create task form handlers
  // ============================================================

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateSubtask(index, value) {
    setForm((prev) => {
      const subtasks = [...prev.subtasks];
      subtasks[index] = value;
      return { ...prev, subtasks };
    });
  }

  function addSubtaskField() {
    setForm((prev) => ({ ...prev, subtasks: [...prev.subtasks, ""] }));
  }

  function removeSubtaskField(index) {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  }

  // ============================================================
  // POST /api/manager/tasks
  // ============================================================

  async function handleCreateTask(event) {
    event.preventDefault();

    setFormError(null);

    if (!form.cohortId) {
      setFormError(
        "Cohort ID is required (ask whoever owns the DB for the cohort's id).",
      );
      return;
    }

    try {
      setCreating(true);

      const payload = {
        title: form.title,
        description: form.description || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        urgency: form.urgency,
        cohortId: Number(form.cohortId),
        subtasks: form.subtasks
          .map((title) => title.trim())
          .filter(Boolean)
          .map((title, index) => ({ title, orderIndex: index })),
      };

      const response = await fetch(`${API_BASE_URL}/manager/tasks`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(", ")
          : data.detail || `Failed to create task: ${response.status}`;

        throw new Error(message);
      }

      setForm(EMPTY_FORM);

      await fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);

      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ============================================================
  // DELETE /api/manager/tasks/{task_id}
  // ============================================================

  async function handleDeleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/manager/tasks/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }

      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
        setProgressSummary(null);
        setSelectedTraineeId(null);
        setTraineeDetail(null);
      }

      await fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);

      setError(err.message);
    }
  }

  // ============================================================
  // GET /api/manager/tasks/{task_id}/progress
  // ============================================================

  async function handleSelectTask(taskId) {
    setSelectedTaskId(taskId);
    setSelectedTraineeId(null);
    setTraineeDetail(null);

    try {
      setProgressLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/manager/tasks/${taskId}/progress`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }

      const data = await response.json();

      setProgressSummary(data);
    } catch (err) {
      console.error("Error fetching task progress:", err);

      setError(err.message);
    } finally {
      setProgressLoading(false);
    }
  }

  // ============================================================
  // GET /api/manager/tasks/{task_id}/progress/{trainee_id}
  // ============================================================

  async function handleSelectTrainee(traineeId) {
    setSelectedTraineeId(traineeId);

    try {
      setTraineeLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/manager/tasks/${selectedTaskId}/progress/${traineeId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch trainee progress: ${response.status}`);
      }

      const data = await response.json();

      setTraineeDetail(data);
    } catch (err) {
      console.error("Error fetching trainee progress:", err);

      setError(err.message);
    } finally {
      setTraineeLoading(false);
    }
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className={styles.container}>
      {/* ======================================================
          CREATE TASK
      ====================================================== */}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <p className={styles.label}>NEW TASK</p>

          <h2>Create a Task</h2>
        </div>

        <form onSubmit={handleCreateTask} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>

              <input
                id="title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="cohortId">Cohort ID</label>

              <input
                id="cohortId"
                type="number"
                min="1"
                value={form.cohortId}
                onChange={(event) =>
                  updateField("cohortId", event.target.value)
                }
                placeholder="e.g. 1"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={2}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="dueDate">Due Date</label>

              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  updateField("dueDate", event.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="urgency">Urgency</label>

              <select
                id="urgency"
                value={form.urgency}
                onChange={(event) =>
                  updateField("urgency", event.target.value)
                }
              >
                {URGENCY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Subtasks</label>

            {form.subtasks.map((subtask, index) => (
              <div key={index} className={styles.subtaskRow}>
                <input
                  value={subtask}
                  onChange={(event) => updateSubtask(index, event.target.value)}
                  placeholder={`Subtask ${index + 1}`}
                />

                {form.subtasks.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeSubtaskField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={addSubtaskField}
            >
              + Add Subtask
            </button>
          </div>

          {formError && (
            <div className={styles.error} role="alert">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>

      {/* ======================================================
          TASK LIST
      ====================================================== */}

      <div className={styles.header}>
        <div>
          <p className={styles.label}>MANAGER TASK BOARD</p>

          <h2>My Tasks</h2>
        </div>

        <p className={styles.taskCount}>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : tasks.length === 0 ? (
        <div className={styles.empty}>
          <h3>No tasks yet</h3>

          <p>Create your first task above.</p>
        </div>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.taskCard} ${
                selectedTaskId === task.id ? styles.taskCardActive : ""
              }`}
            >
              <button
                type="button"
                className={styles.taskCardMain}
                onClick={() => handleSelectTask(task.id)}
              >
                <div className={styles.taskCardHeader}>
                  <h3>{task.title}</h3>

                  <span className={styles.statusBadge}>{task.urgency}</span>
                </div>

                {task.description && (
                  <p className={styles.description}>{task.description}</p>
                )}

                <div className={styles.taskMeta}>
                  {task.dueDate && <span>Due: {task.dueDate}</span>}

                  <span>{task.assignedTraineeCount} trainee(s)</span>
                </div>
              </button>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          TASK PROGRESS
      ====================================================== */}

      {selectedTaskId && (
        <div className={styles.progressCard}>
          <div className={styles.cardHeader}>
            <p className={styles.label}>TASK PROGRESS</p>

            <h2>How the cohort is doing</h2>
          </div>

          {progressLoading ? (
            <p>Loading progress...</p>
          ) : progressSummary ? (
            <>
              <div className={styles.averageBar}>
                <div className={styles.averageBarTrack}>
                  <div
                    className={styles.averageBarFill}
                    style={{ width: `${progressSummary.averagePercentage}%` }}
                  />
                </div>

                <span>{progressSummary.averagePercentage}% average</span>
              </div>

              <div className={styles.traineeList}>
                {progressSummary.trainees.length === 0 ? (
                  <p>No trainees assigned to this task.</p>
                ) : (
                  progressSummary.trainees.map((trainee) => (
                    <button
                      type="button"
                      key={trainee.traineeId}
                      className={`${styles.traineeRow} ${
                        selectedTraineeId === trainee.traineeId
                          ? styles.traineeRowActive
                          : ""
                      }`}
                      onClick={() => handleSelectTrainee(trainee.traineeId)}
                    >
                      <span className={styles.traineeName}>
                        {trainee.fullName}
                      </span>

                      <div className={styles.traineeBarTrack}>
                        <div
                          className={styles.traineeBarFill}
                          style={{ width: `${trainee.currentPercentage}%` }}
                        />
                      </div>

                      <span>{trainee.currentPercentage}%</span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <p>Select a task above to see its progress.</p>
          )}

          {/* ==================================================
              TRAINEE DETAIL
          ================================================== */}

          {selectedTraineeId && (
            <div className={styles.traineeDetail}>
              <h3>Trainee Detail</h3>

              {traineeLoading ? (
                <p>Loading...</p>
              ) : traineeDetail ? (
                <>
                  <p className={styles.traineeDetailName}>
                    {traineeDetail.trainee.fullName} &mdash;{" "}
                    {traineeDetail.currentPercentage}% complete
                  </p>

                  {traineeDetail.subtasks.length > 0 && (
                    <div className={styles.subtasks}>
                      <h4>Subtasks</h4>

                      {traineeDetail.subtasks.map((subtask) => (
                        <div key={subtask.id} className={styles.subtask}>
                          <input
                            type="checkbox"
                            checked={subtask.isCompleted}
                            readOnly
                          />

                          <span>{subtask.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.history}>
                    <h4>Progress History</h4>

                    {traineeDetail.history.length === 0 ? (
                      <p>No updates submitted yet.</p>
                    ) : (
                      traineeDetail.history.map((entry, index) => (
                        <div key={index} className={styles.historyItem}>
                          <strong>{entry.percentage}%</strong>

                          {entry.comment && <span>{entry.comment}</span>}

                          <small>{entry.createdAt}</small>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
