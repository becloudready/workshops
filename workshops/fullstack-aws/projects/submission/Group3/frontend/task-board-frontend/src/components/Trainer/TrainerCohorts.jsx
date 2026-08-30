import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TrainerCohorts.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ENDPOINTS = {
  cohorts: `${API_BASE_URL}/manager/cohorts`,
  cohort: (cohortId) => `${API_BASE_URL}/manager/cohorts/${cohortId}`,

  tasks: `${API_BASE_URL}/manager/tasks`,
  task: (taskId) => `${API_BASE_URL}/manager/tasks/${taskId}`,

  taskProgress: (taskId) => `${API_BASE_URL}/manager/tasks/${taskId}/progress`,

  traineeProgress: (taskId, traineeId) =>
    `${API_BASE_URL}/manager/tasks/${taskId}/progress/${traineeId}`,
};

export default function TrainerCohorts() {
  const { accessToken, tokenType, isAuthenticated } = useSelector(
    (state) => state.trainee,
  );

  // ============================================================
  // COHORT DATA
  // ============================================================

  const [cohorts, setCohorts] = useState([]);
  const [expandedCohortId, setExpandedCohortId] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);

  // ============================================================
  // TASK DATA
  // ============================================================

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // ============================================================
  // TRAINEE PROGRESS
  // ============================================================

  const [expandedTraineeId, setExpandedTraineeId] = useState(null);
  const [traineeProgress, setTraineeProgress] = useState(null);

  // One dropdown for the selected trainee's progress history
  const [progressUpdatesOpen, setProgressUpdatesOpen] = useState(false);

  // ============================================================
  // CREATE TASK
  // ============================================================

  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    urgency: "medium",
    subtasks: [{ title: "" }],
  });

  // ============================================================
  // CREATE COHORT
  // ============================================================

  const [createCohortOpen, setCreateCohortOpen] = useState(false);

  const [cohortForm, setCohortForm] = useState({
    name: "",
    description: "",
  });

  // ============================================================
  // LOADING
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [cohortLoading, setCohortLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [traineeLoading, setTraineeLoading] = useState(false);

  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [cohortSubmitting, setCohortSubmitting] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // FIX: This state was missing.
  const [deletingCohortId, setDeletingCohortId] = useState(null);

  // ============================================================
  // ERROR
  // ============================================================

  const [error, setError] = useState(null);

  // ============================================================
  // AUTH
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
  // RESPONSE HANDLER
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
        } else if (Array.isArray(errorData?.detail)) {
          message = errorData.detail
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(", ");
        }
      } catch {
        // Ignore non-JSON responses.
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
  // FETCH COHORTS
  // ============================================================

  async function fetchCohorts() {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !accessToken) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(ENDPOINTS.cohorts, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(
        response,
        `Failed to fetch cohorts: ${response.status}`,
      );

      setCohorts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching cohorts:", err);

      setError(err instanceof Error ? err.message : "Unable to load cohorts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCohorts();
  }, [accessToken, tokenType, isAuthenticated]);

  // ============================================================
  // FETCH COHORT DETAILS
  // ============================================================

  async function fetchCohort(cohortId) {
    try {
      setCohortLoading(true);
      setError(null);

      const response = await fetch(ENDPOINTS.cohort(cohortId), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(
        response,
        `Failed to fetch cohort: ${response.status}`,
      );

      setSelectedCohort(data);
    } catch (err) {
      console.error("Error fetching cohort:", err);

      setError(err instanceof Error ? err.message : "Unable to load cohort.");
    } finally {
      setCohortLoading(false);
    }
  }

  // ============================================================
  // RESET EXPANDED STATE
  // ============================================================

  function resetExpandedState() {
    setSelectedCohort(null);
    setSelectedTask(null);
    setTaskProgress(null);

    setExpandedTaskId(null);
    setExpandedTraineeId(null);
    setTraineeProgress(null);
    setProgressUpdatesOpen(false);
  }

  // ============================================================
  // COHORT EXPANSION
  // ============================================================

  function handleCohortClick(cohortId) {
    if (expandedCohortId === cohortId) {
      setExpandedCohortId(null);
      resetExpandedState();
      return;
    }

    setExpandedCohortId(cohortId);
    resetExpandedState();

    fetchCohort(cohortId);
  }

  // ============================================================
  // TASK FORM
  // ============================================================

  function updateTaskForm(field, value) {
    setTaskForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSubtask(index, value) {
    setTaskForm((current) => ({
      ...current,
      subtasks: current.subtasks.map((subtask, subtaskIndex) =>
        subtaskIndex === index ? { ...subtask, title: value } : subtask,
      ),
    }));
  }

  function addSubtask() {
    setTaskForm((current) => ({
      ...current,
      subtasks: [...current.subtasks, { title: "" }],
    }));
  }

  function removeSubtask(index) {
    setTaskForm((current) => ({
      ...current,
      subtasks: current.subtasks.filter(
        (_, subtaskIndex) => subtaskIndex !== index,
      ),
    }));
  }

  function resetTaskForm() {
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      urgency: "medium",
      subtasks: [{ title: "" }],
    });
  }

  // ============================================================
  // CREATE TASK
  // ============================================================

  async function createTask(event) {
    event.preventDefault();

    if (!selectedCohort) {
      setError("No cohort selected.");
      return;
    }

    if (!taskForm.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setTaskSubmitting(true);
      setError(null);

      const subtasks = taskForm.subtasks
        .map((subtask, index) => ({
          title: subtask.title.trim(),
          orderIndex: index,
        }))
        .filter((subtask) => subtask.title);

      const body = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || null,
        dueDate: taskForm.dueDate
          ? new Date(taskForm.dueDate).toISOString()
          : null,
        urgency: taskForm.urgency,
        cohortId: Number(selectedCohort.id),
        subtasks,
      };

      const response = await fetch(ENDPOINTS.tasks, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      await handleResponse(
        response,
        `Failed to create task: ${response.status}`,
      );

      resetTaskForm();
      setCreateTaskOpen(false);

      await fetchCohort(selectedCohort.id);
      await fetchCohorts();
    } catch (err) {
      console.error("Error creating task:", err);

      setError(err instanceof Error ? err.message : "Unable to create task.");
    } finally {
      setTaskSubmitting(false);
    }
  }

  // ============================================================
  // CREATE COHORT
  // ============================================================

  async function createCohort(event) {
    event.preventDefault();

    if (!cohortForm.name.trim()) {
      setError("Cohort name is required.");
      return;
    }

    try {
      setCohortSubmitting(true);
      setError(null);

      const response = await fetch(ENDPOINTS.cohorts, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: cohortForm.name.trim(),
          description: cohortForm.description.trim() || null,
        }),
      });

      const createdCohort = await handleResponse(
        response,
        `Failed to create cohort: ${response.status}`,
      );

      setCohortForm({
        name: "",
        description: "",
      });

      setCreateCohortOpen(false);

      if (createdCohort) {
        setCohorts((current) => [...current, createdCohort]);
      } else {
        await fetchCohorts();
      }
    } catch (err) {
      console.error("Error creating cohort:", err);

      setError(err instanceof Error ? err.message : "Unable to create cohort.");
    } finally {
      setCohortSubmitting(false);
    }
  }

  // ============================================================
  // FETCH TASK + OVERALL PROGRESS
  // ============================================================

  async function fetchTask(taskId) {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setSelectedTask(null);
      setTaskProgress(null);
      setExpandedTraineeId(null);
      setTraineeProgress(null);
      setProgressUpdatesOpen(false);

      return;
    }

    try {
      setExpandedTaskId(taskId);
      setSelectedTask(null);
      setTaskProgress(null);

      setExpandedTraineeId(null);
      setTraineeProgress(null);
      setProgressUpdatesOpen(false);

      setTaskLoading(true);
      setProgressLoading(true);
      setError(null);

      const [taskResponse, progressResponse] = await Promise.all([
        fetch(ENDPOINTS.task(taskId), {
          method: "GET",
          headers: getAuthHeaders(),
        }),

        fetch(ENDPOINTS.taskProgress(taskId), {
          method: "GET",
          headers: getAuthHeaders(),
        }),
      ]);

      const taskData = await handleResponse(
        taskResponse,
        `Failed to fetch task: ${taskResponse.status}`,
      );

      const progressData = await handleResponse(
        progressResponse,
        `Failed to fetch task progress: ${progressResponse.status}`,
      );

      setSelectedTask(taskData);
      setTaskProgress(progressData);
    } catch (err) {
      console.error("Error fetching task:", err);

      setError(err instanceof Error ? err.message : "Unable to load task.");
    } finally {
      setTaskLoading(false);
      setProgressLoading(false);
    }
  }

  // ============================================================
  // FETCH TRAINEE PROGRESS
  // ============================================================

  async function fetchTraineeProgress(taskId, traineeId) {
    if (expandedTraineeId === traineeId) {
      setExpandedTraineeId(null);
      setTraineeProgress(null);
      setProgressUpdatesOpen(false);

      return;
    }

    try {
      setExpandedTraineeId(traineeId);
      setTraineeProgress(null);
      setProgressUpdatesOpen(false);
      setTraineeLoading(true);
      setError(null);

      const response = await fetch(
        ENDPOINTS.traineeProgress(taskId, traineeId),
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const data = await handleResponse(
        response,
        `Failed to fetch trainee progress: ${response.status}`,
      );

      setTraineeProgress(data);
    } catch (err) {
      console.error("Error fetching trainee progress:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load trainee progress.",
      );
    } finally {
      setTraineeLoading(false);
    }
  }

  // ============================================================
  // DELETE TASK
  // ============================================================

  async function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This will remove it for everyone assigned to it.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      setError(null);

      const response = await fetch(ENDPOINTS.task(taskId), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      await handleResponse(
        response,
        `Failed to delete task: ${response.status}`,
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setTaskProgress(null);
        setExpandedTaskId(null);
        setExpandedTraineeId(null);
        setTraineeProgress(null);
        setProgressUpdatesOpen(false);
      }

      if (selectedCohort?.id) {
        await fetchCohort(selectedCohort.id);
      }

      await fetchCohorts();
    } catch (err) {
      console.error("Error deleting task:", err);

      setError(err instanceof Error ? err.message : "Unable to delete task.");
    } finally {
      setDeletingTaskId(null);
    }
  }

  // ============================================================
  // DELETE COHORT
  // ============================================================

  async function deleteCohort(cohortId) {
    const cohort = cohorts.find((item) => item.id === cohortId);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        cohort?.name || `Cohort ${cohortId}`
      }"? This will delete the cohort and its tasks.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCohortId(cohortId);
      setError(null);

      const response = await fetch(ENDPOINTS.cohort(cohortId), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      await handleResponse(
        response,
        `Failed to delete cohort: ${response.status}`,
      );

      // If this cohort was open, clear all of its state.
      if (expandedCohortId === cohortId) {
        setExpandedCohortId(null);
        resetExpandedState();
      }

      // Remove it immediately from the UI.
      setCohorts((current) => current.filter((item) => item.id !== cohortId));
    } catch (err) {
      console.error("Error deleting cohort:", err);

      setError(err instanceof Error ? err.message : "Unable to delete cohort.");
    } finally {
      setDeletingCohortId(null);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function getPercentage(value) {
    return Math.min(100, Math.max(0, Number(value ?? 0)));
  }

  function getTraineeId(trainee) {
    return trainee.traineeId ?? trainee.trainee_id ?? trainee.id;
  }

  function getTraineeName(trainee) {
    return (
      trainee.fullName ??
      trainee.full_name ??
      trainee.name ??
      `Trainee ${getTraineeId(trainee)}`
    );
  }

  /*
   * Subtasks are binary:
   *
   * completed   -> 100%
   * incomplete  -> 0%
   *
   * We intentionally DO NOT use a subtask percentage field.
   */
  function isSubtaskCompleted(subtask) {
    return Boolean(subtask.isCompleted ?? subtask.is_completed ?? false);
  }

  function getOverallProgress(progress) {
    if (!progress) {
      return 0;
    }

    if (progress.averagePercentage != null) {
      return getPercentage(progress.averagePercentage);
    }

    if (progress.average_percentage != null) {
      return getPercentage(progress.average_percentage);
    }

    if (progress.currentPercentage != null) {
      return getPercentage(progress.currentPercentage);
    }

    if (progress.current_percentage != null) {
      return getPercentage(progress.current_percentage);
    }

    return 0;
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className={styles.status}>
        <p>Loading cohorts...</p>
      </div>
    );
  }

  // ============================================================
  // INITIAL ERROR
  // ============================================================

  if (error && cohorts.length === 0) {
    return (
      <div className={styles.error}>
        <h2>Unable to load cohorts</h2>
        <p>{error}</p>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={`${styles.container} themeInvert`}>
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className={styles.header}>
        <div>
          <p className={styles.label}>TRAINER DASHBOARD</p>
          <h2>Cohorts</h2>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.count}>
            {cohorts.length} {cohorts.length === 1 ? "cohort" : "cohorts"}
          </span>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setCreateCohortOpen((current) => !current)}
          >
            {createCohortOpen ? "Cancel" : "+ New Cohort"}
          </button>
        </div>
      </div>

      {/* ========================================================
          CREATE COHORT
      ======================================================== */}

      <AnimatePresence initial={false}>
        {createCohortOpen && (
          <motion.section
            className={styles.createCohortPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.label}>COHORT MANAGEMENT</p>
                <h4>Create New Cohort</h4>
              </div>
            </div>

            <form className={styles.taskForm} onSubmit={createCohort}>
              <div className={styles.formGroup}>
                <label htmlFor="new-cohort-name">Cohort Name</label>

                <input
                  id="new-cohort-name"
                  type="text"
                  value={cohortForm.name}
                  onChange={(event) =>
                    setCohortForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. January 2027 Cohort"
                  disabled={cohortSubmitting}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-cohort-description">Description</label>

                <textarea
                  id="new-cohort-description"
                  value={cohortForm.description}
                  onChange={(event) =>
                    setCohortForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe this cohort..."
                  rows={4}
                  disabled={cohortSubmitting}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={cohortSubmitting}
              >
                {cohortSubmitting ? "Creating Cohort..." : "Create Cohort"}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {/* ========================================================
          COHORT LIST
      ======================================================== */}

      <div className={styles.cohortList}>
        {cohorts.length === 0 ? (
          <div className={styles.empty}>
            <h3>No cohorts</h3>
            <p>There are currently no cohorts to display.</p>
          </div>
        ) : (
          cohorts.map((cohort) => {
            const cohortId = cohort.id;
            const isOpen = expandedCohortId === cohortId;

            const traineeCount =
              cohort.traineeCount ?? cohort.trainee_count ?? 0;

            return (
              <motion.div
                key={cohortId}
                layout
                className={`${styles.cohortCard} ${
                  isOpen ? styles.cohortCardOpen : ""
                }`}
              >
                {/* ==================================================
                    COHORT HEADER
                ================================================== */}

                <div className={styles.cohortHeader}>
                  <button
                    type="button"
                    className={styles.cohortHeaderButton}
                    onClick={() => handleCohortClick(cohortId)}
                    aria-expanded={isOpen}
                  >
                    <div>
                      <p className={styles.label}>COHORT</p>

                      <h3>{cohort.name || `Cohort ${cohortId}`}</h3>

                      {cohort.description && (
                        <p className={styles.cohortDescription}>
                          {cohort.description}
                        </p>
                      )}
                    </div>

                    <div className={styles.cohortHeaderRight}>
                      <span>
                        {traineeCount}{" "}
                        {traineeCount === 1 ? "trainee" : "trainees"}
                      </span>

                      <motion.span
                        animate={{
                          rotate: isOpen ? 180 : 0,
                        }}
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={styles.deleteCohortButton}
                    onClick={() => deleteCohort(cohortId)}
                    disabled={deletingCohortId === cohortId}
                  >
                    {deletingCohortId === cohortId ? "Deleting..." : "Delete"}
                  </button>
                </div>

                {/* ==================================================
                    COHORT CONTENT
                ================================================== */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.cohortContent}
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
                    >
                      <div className={styles.cohortInner}>
                        {cohortLoading ? (
                          <div className={styles.loadingInline}>
                            Loading cohort...
                          </div>
                        ) : selectedCohort ? (
                          <>
                            {/* ==================================================
                                TRAINEES
                            ================================================== */}

                            <section className={styles.section}>
                              <div className={styles.sectionHeader}>
                                <div>
                                  <p className={styles.label}>TRAINEES</p>

                                  <h4>Assigned Trainees</h4>
                                </div>

                                <span className={styles.sectionCount}>
                                  {(selectedCohort.trainees || []).length}
                                </span>
                              </div>

                              {!selectedCohort.trainees?.length ? (
                                <div className={styles.emptySmall}>
                                  <p>
                                    No trainees are assigned to this cohort.
                                  </p>
                                </div>
                              ) : (
                                <div className={styles.traineeList}>
                                  {selectedCohort.trainees.map((trainee) => {
                                    const traineeId = getTraineeId(trainee);

                                    const name = getTraineeName(trainee);

                                    return (
                                      <div
                                        key={traineeId}
                                        className={styles.traineeBlock}
                                      >
                                        <div className={styles.traineeButton}>
                                          <div
                                            className={styles.traineeIdentity}
                                          >
                                            <div className={styles.avatar}>
                                              {name.charAt(0).toUpperCase()}
                                            </div>

                                            <div>
                                              <strong>{name}</strong>

                                              {trainee.email && (
                                                <small>{trainee.email}</small>
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <small>
                                              Progress is available per task
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </section>

                            {/* ==================================================
                                CREATE TASK
                            ================================================== */}

                            <section className={styles.section}>
                              <button
                                type="button"
                                className={styles.collapsibleHeader}
                                onClick={() =>
                                  setCreateTaskOpen((current) => !current)
                                }
                                aria-expanded={createTaskOpen}
                              >
                                <div>
                                  <p className={styles.label}>
                                    TASK MANAGEMENT
                                  </p>

                                  <h4>Create Cohort Task</h4>
                                </div>

                                <span>{createTaskOpen ? "▲" : "▼"}</span>
                              </button>

                              <AnimatePresence initial={false}>
                                {createTaskOpen && (
                                  <motion.div
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
                                  >
                                    <form
                                      className={styles.taskForm}
                                      onSubmit={createTask}
                                    >
                                      <div className={styles.formGroup}>
                                        <label htmlFor={`title-${cohortId}`}>
                                          Task Title
                                        </label>

                                        <input
                                          id={`title-${cohortId}`}
                                          type="text"
                                          value={taskForm.title}
                                          onChange={(event) =>
                                            updateTaskForm(
                                              "title",
                                              event.target.value,
                                            )
                                          }
                                          placeholder="Enter task title"
                                          disabled={taskSubmitting}
                                          required
                                        />
                                      </div>

                                      <div className={styles.formGroup}>
                                        <label
                                          htmlFor={`description-${cohortId}`}
                                        >
                                          Description
                                        </label>

                                        <textarea
                                          id={`description-${cohortId}`}
                                          value={taskForm.description}
                                          onChange={(event) =>
                                            updateTaskForm(
                                              "description",
                                              event.target.value,
                                            )
                                          }
                                          placeholder="Describe the task..."
                                          rows={4}
                                          disabled={taskSubmitting}
                                        />
                                      </div>

                                      <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                          <label
                                            htmlFor={`dueDate-${cohortId}`}
                                          >
                                            Due Date
                                          </label>

                                          <input
                                            id={`dueDate-${cohortId}`}
                                            type="datetime-local"
                                            value={taskForm.dueDate}
                                            onChange={(event) =>
                                              updateTaskForm(
                                                "dueDate",
                                                event.target.value,
                                              )
                                            }
                                            disabled={taskSubmitting}
                                          />
                                        </div>

                                        <div className={styles.formGroup}>
                                          <label
                                            htmlFor={`urgency-${cohortId}`}
                                          >
                                            Urgency
                                          </label>

                                          <select
                                            id={`urgency-${cohortId}`}
                                            value={taskForm.urgency}
                                            onChange={(event) =>
                                              updateTaskForm(
                                                "urgency",
                                                event.target.value,
                                              )
                                            }
                                            disabled={taskSubmitting}
                                          >
                                            <option value="low">Low</option>

                                            <option value="medium">
                                              Medium
                                            </option>

                                            <option value="high">High</option>

                                            <option value="urgent">
                                              Urgent
                                            </option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* ==================================================
                                          SUBTASKS
                                      ================================================== */}

                                      <div className={styles.subtaskForm}>
                                        <div
                                          className={styles.subtaskFormHeader}
                                        >
                                          <label>Subtasks</label>

                                          <button
                                            type="button"
                                            className={styles.secondaryButton}
                                            onClick={addSubtask}
                                            disabled={taskSubmitting}
                                          >
                                            + Add Subtask
                                          </button>
                                        </div>

                                        <div className={styles.subtaskInputs}>
                                          {taskForm.subtasks.map(
                                            (subtask, index) => (
                                              <div
                                                key={index}
                                                className={styles.subtaskInput}
                                              >
                                                <span>{index + 1}</span>

                                                <input
                                                  type="text"
                                                  value={subtask.title}
                                                  onChange={(event) =>
                                                    updateSubtask(
                                                      index,
                                                      event.target.value,
                                                    )
                                                  }
                                                  placeholder={`Subtask ${
                                                    index + 1
                                                  }`}
                                                  disabled={taskSubmitting}
                                                />

                                                {taskForm.subtasks.length >
                                                  1 && (
                                                  <button
                                                    type="button"
                                                    className={
                                                      styles.removeButton
                                                    }
                                                    onClick={() =>
                                                      removeSubtask(index)
                                                    }
                                                    disabled={taskSubmitting}
                                                  >
                                                    ×
                                                  </button>
                                                )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>

                                      <button
                                        type="submit"
                                        className={styles.primaryButton}
                                        disabled={taskSubmitting}
                                      >
                                        {taskSubmitting
                                          ? "Creating Task..."
                                          : "Create Task"}
                                      </button>
                                    </form>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </section>

                            {/* ==================================================
                                TASKS
                            ================================================== */}

                            <section className={styles.section}>
                              <div className={styles.sectionHeader}>
                                <div>
                                  <p className={styles.label}>COHORT TASKS</p>

                                  <h4>Assigned Tasks</h4>
                                </div>

                                <span className={styles.sectionCount}>
                                  {(selectedCohort.tasks || []).length}
                                </span>
                              </div>

                              {!selectedCohort.tasks?.length ? (
                                <div className={styles.emptySmall}>
                                  <p>
                                    No tasks have been assigned to this cohort.
                                  </p>
                                </div>
                              ) : (
                                <div className={styles.taskList}>
                                  {selectedCohort.tasks.map((task) => {
                                    const isSelected =
                                      expandedTaskId === task.id;

                                    const urgency = task.urgency
                                      ?.toString()
                                      .toLowerCase();

                                    return (
                                      <motion.div
                                        key={task.id}
                                        layout
                                        className={styles.task}
                                      >
                                        {/* ==================================================
                                              TASK HEADER
                                          ================================================== */}

                                        <button
                                          type="button"
                                          className={styles.taskButton}
                                          onClick={() => fetchTask(task.id)}
                                        >
                                          <div className={styles.taskInfo}>
                                            <div>
                                              <h5>{task.title}</h5>

                                              {task.description && (
                                                <p>{task.description}</p>
                                              )}
                                            </div>

                                            {urgency && (
                                              <span
                                                className={`${styles.urgency} ${
                                                  styles[
                                                    `urgency${
                                                      urgency
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      urgency.slice(1)
                                                    }`
                                                  ] || ""
                                                }`}
                                              >
                                                {urgency}
                                              </span>
                                            )}
                                          </div>
                                        </button>

                                        <div className={styles.taskFooter}>
                                          {task.dueDate && (
                                            <span>
                                              Due{" "}
                                              {new Date(
                                                task.dueDate,
                                              ).toLocaleDateString()}
                                            </span>
                                          )}

                                          <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => deleteTask(task.id)}
                                            disabled={
                                              deletingTaskId === task.id
                                            }
                                          >
                                            {deletingTaskId === task.id
                                              ? "Deleting..."
                                              : "Delete"}
                                          </button>

                                          <span>
                                            {isSelected
                                              ? "Hide Progress"
                                              : "View Progress"}
                                          </span>
                                        </div>

                                        {/* ==================================================
                                              TASK PROGRESS
                                          ================================================== */}

                                        <AnimatePresence initial={false}>
                                          {isSelected && (
                                            <motion.div
                                              className={styles.taskProgress}
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
                                            >
                                              {taskLoading ||
                                              progressLoading ? (
                                                <p>Loading progress...</p>
                                              ) : (
                                                <>
                                                  {/* ==================================================
                                                        OVERALL PROGRESS
                                                    ================================================== */}

                                                  <div
                                                    className={
                                                      styles.progressSummary
                                                    }
                                                  >
                                                    <strong>
                                                      Overall Progress
                                                    </strong>

                                                    <span>
                                                      {getOverallProgress(
                                                        taskProgress,
                                                      ).toFixed(1)}
                                                      %
                                                    </span>
                                                  </div>

                                                  {/* ==================================================
                                                        TRAINEES
                                                    ================================================== */}

                                                  {taskProgress?.trainees
                                                    ?.length > 0 ? (
                                                    <div
                                                      className={
                                                        styles.traineeList
                                                      }
                                                    >
                                                      {taskProgress.trainees.map(
                                                        (trainee) => {
                                                          const traineeId =
                                                            getTraineeId(
                                                              trainee,
                                                            );

                                                          const traineeName =
                                                            getTraineeName(
                                                              trainee,
                                                            );

                                                          const percentage =
                                                            getPercentage(
                                                              trainee.currentPercentage ??
                                                                trainee.current_percentage ??
                                                                trainee.progress,
                                                            );

                                                          const traineeOpen =
                                                            expandedTraineeId ===
                                                            traineeId;

                                                          return (
                                                            <div
                                                              key={traineeId}
                                                              className={
                                                                styles.traineeBlock
                                                              }
                                                            >
                                                              <button
                                                                type="button"
                                                                className={
                                                                  styles.traineeButton
                                                                }
                                                                onClick={() =>
                                                                  fetchTraineeProgress(
                                                                    task.id,
                                                                    traineeId,
                                                                  )
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.traineeIdentity
                                                                  }
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles.avatar
                                                                    }
                                                                  >
                                                                    {traineeName
                                                                      .charAt(0)
                                                                      .toUpperCase()}
                                                                  </div>

                                                                  <div>
                                                                    <strong>
                                                                      {
                                                                        traineeName
                                                                      }
                                                                    </strong>

                                                                    {trainee.lastUpdatedAt && (
                                                                      <small>
                                                                        Updated{" "}
                                                                        {new Date(
                                                                          trainee.lastUpdatedAt,
                                                                        ).toLocaleDateString()}
                                                                      </small>
                                                                    )}
                                                                  </div>
                                                                </div>

                                                                <div
                                                                  className={
                                                                    styles.progressWrapper
                                                                  }
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles.progressLabel
                                                                    }
                                                                  >
                                                                    <span>
                                                                      Progress
                                                                    </span>

                                                                    <strong>
                                                                      {
                                                                        percentage
                                                                      }
                                                                      %
                                                                    </strong>
                                                                  </div>

                                                                  <div
                                                                    className={
                                                                      styles.progressTrack
                                                                    }
                                                                  >
                                                                    <motion.div
                                                                      className={
                                                                        styles.progressBar
                                                                      }
                                                                      animate={{
                                                                        width: `${percentage}%`,
                                                                      }}
                                                                    />
                                                                  </div>
                                                                </div>

                                                                <span
                                                                  className={
                                                                    styles.expandIcon
                                                                  }
                                                                >
                                                                  {traineeOpen
                                                                    ? "▲"
                                                                    : "▼"}
                                                                </span>
                                                              </button>

                                                              {/* ==================================================
                                                                    TRAINEE DETAILS
                                                                ================================================== */}

                                                              <AnimatePresence
                                                                initial={false}
                                                              >
                                                                {traineeOpen && (
                                                                  <motion.div
                                                                    className={
                                                                      styles.traineeDetails
                                                                    }
                                                                    initial={{
                                                                      height: 0,
                                                                      opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                      height:
                                                                        "auto",
                                                                      opacity: 1,
                                                                    }}
                                                                    exit={{
                                                                      height: 0,
                                                                      opacity: 0,
                                                                    }}
                                                                  >
                                                                    {traineeLoading ? (
                                                                      <p>
                                                                        Loading
                                                                        trainee
                                                                        progress...
                                                                      </p>
                                                                    ) : traineeProgress ? (
                                                                      <>
                                                                        {/* ==================================================
                                                                              SUBTASKS
                                                                          ================================================== */}

                                                                        <div
                                                                          className={
                                                                            styles.subtaskProgressSection
                                                                          }
                                                                        >
                                                                          <div
                                                                            className={
                                                                              styles.subtaskProgressHeader
                                                                            }
                                                                          >
                                                                            <div>
                                                                              <p
                                                                                className={
                                                                                  styles.label
                                                                                }
                                                                              >
                                                                                SUBTASKS
                                                                              </p>

                                                                              <h5>
                                                                                Task
                                                                                Checklist
                                                                              </h5>
                                                                            </div>

                                                                            <span
                                                                              className={
                                                                                styles.sectionCount
                                                                              }
                                                                            >
                                                                              {
                                                                                (
                                                                                  traineeProgress.subtasks ||
                                                                                  []
                                                                                )
                                                                                  .length
                                                                              }
                                                                            </span>
                                                                          </div>

                                                                          {!traineeProgress
                                                                            .subtasks
                                                                            ?.length ? (
                                                                            <div
                                                                              className={
                                                                                styles.emptySmall
                                                                              }
                                                                            >
                                                                              <p>
                                                                                No
                                                                                subtasks
                                                                                have
                                                                                been
                                                                                assigned
                                                                                to
                                                                                this
                                                                                task.
                                                                              </p>
                                                                            </div>
                                                                          ) : (
                                                                            <div
                                                                              className={
                                                                                styles.subtaskProgressList
                                                                              }
                                                                            >
                                                                              {traineeProgress.subtasks.map(
                                                                                (
                                                                                  subtask,
                                                                                ) => {
                                                                                  const completed =
                                                                                    isSubtaskCompleted(
                                                                                      subtask,
                                                                                    );

                                                                                  return (
                                                                                    <div
                                                                                      key={
                                                                                        subtask.id
                                                                                      }
                                                                                      className={`${styles.subtaskProgressItem} ${
                                                                                        completed
                                                                                          ? styles.subtaskProgressItemComplete
                                                                                          : ""
                                                                                      }`}
                                                                                    >
                                                                                      <div
                                                                                        className={
                                                                                          styles.subtaskProgressRow
                                                                                        }
                                                                                      >
                                                                                        <div
                                                                                          className={
                                                                                            styles.subtaskIdentity
                                                                                          }
                                                                                        >
                                                                                          <span
                                                                                            className={
                                                                                              completed
                                                                                                ? styles.subtaskComplete
                                                                                                : styles.subtaskIncomplete
                                                                                            }
                                                                                          >
                                                                                            {completed
                                                                                              ? "✓"
                                                                                              : "○"}
                                                                                          </span>

                                                                                          <div>
                                                                                            <strong>
                                                                                              {
                                                                                                subtask.title
                                                                                              }
                                                                                            </strong>

                                                                                            <small>
                                                                                              {completed
                                                                                                ? "Completed"
                                                                                                : "Not completed"}
                                                                                            </small>
                                                                                          </div>
                                                                                        </div>

                                                                                        <span
                                                                                          className={`${styles.subtaskStatus} ${
                                                                                            completed
                                                                                              ? styles.subtaskStatusComplete
                                                                                              : styles.subtaskStatusIncomplete
                                                                                          }`}
                                                                                        >
                                                                                          {completed
                                                                                            ? "Complete"
                                                                                            : "Incomplete"}
                                                                                        </span>
                                                                                      </div>
                                                                                    </div>
                                                                                  );
                                                                                },
                                                                              )}
                                                                            </div>
                                                                          )}

                                                                          {/* ==================================================
                                                                                PROGRESS UPDATES
                                                                            ================================================== */}

                                                                          <div
                                                                            className={
                                                                              styles.progressUpdatesSection
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={
                                                                                styles.progressUpdatesButton
                                                                              }
                                                                              onClick={() =>
                                                                                setProgressUpdatesOpen(
                                                                                  (
                                                                                    current,
                                                                                  ) =>
                                                                                    !current,
                                                                                )
                                                                              }
                                                                              aria-expanded={
                                                                                progressUpdatesOpen
                                                                              }
                                                                            >
                                                                              <div
                                                                                className={
                                                                                  styles.progressUpdatesTitle
                                                                                }
                                                                              >
                                                                                <span
                                                                                  className={
                                                                                    styles.progressUpdatesIcon
                                                                                  }
                                                                                >
                                                                                  ↳
                                                                                </span>

                                                                                <div>
                                                                                  <strong>
                                                                                    Progress
                                                                                    Updates
                                                                                  </strong>

                                                                                  <small>
                                                                                    {traineeProgress
                                                                                      .history
                                                                                      ?.length ||
                                                                                      0}{" "}
                                                                                    {traineeProgress
                                                                                      .history
                                                                                      ?.length ===
                                                                                    1
                                                                                      ? "update"
                                                                                      : "updates"}
                                                                                  </small>
                                                                                </div>
                                                                              </div>

                                                                              <span
                                                                                className={
                                                                                  styles.expandIcon
                                                                                }
                                                                              >
                                                                                {progressUpdatesOpen
                                                                                  ? "▲"
                                                                                  : "▼"}
                                                                              </span>
                                                                            </button>

                                                                            <AnimatePresence
                                                                              initial={
                                                                                false
                                                                              }
                                                                            >
                                                                              {progressUpdatesOpen && (
                                                                                <motion.div
                                                                                  className={
                                                                                    styles.history
                                                                                  }
                                                                                  initial={{
                                                                                    height: 0,
                                                                                    opacity: 0,
                                                                                  }}
                                                                                  animate={{
                                                                                    height:
                                                                                      "auto",
                                                                                    opacity: 1,
                                                                                  }}
                                                                                  exit={{
                                                                                    height: 0,
                                                                                    opacity: 0,
                                                                                  }}
                                                                                >
                                                                                  {traineeProgress
                                                                                    .history
                                                                                    ?.length >
                                                                                  0 ? (
                                                                                    <div
                                                                                      className={
                                                                                        styles.progressUpdateList
                                                                                      }
                                                                                    >
                                                                                      {traineeProgress.history.map(
                                                                                        (
                                                                                          update,
                                                                                          index,
                                                                                        ) => {
                                                                                          const percentage =
                                                                                            Number(
                                                                                              update.percentage ??
                                                                                                0,
                                                                                            );

                                                                                          const completed =
                                                                                            percentage ===
                                                                                            100;

                                                                                          const createdAt =
                                                                                            update.createdAt ??
                                                                                            update.created_at;

                                                                                          return (
                                                                                            <div
                                                                                              key={
                                                                                                update.id ??
                                                                                                index
                                                                                              }
                                                                                              className={
                                                                                                styles.historyEntry
                                                                                              }
                                                                                            >
                                                                                              <div
                                                                                                className={
                                                                                                  styles.historyHeader
                                                                                                }
                                                                                              >
                                                                                                <div>
                                                                                                  <strong>
                                                                                                    {
                                                                                                      percentage
                                                                                                    }

                                                                                                    %
                                                                                                  </strong>

                                                                                                  <small>
                                                                                                    {completed
                                                                                                      ? "Completed"
                                                                                                      : "Progress Update"}
                                                                                                  </small>
                                                                                                </div>

                                                                                                {createdAt && (
                                                                                                  <small>
                                                                                                    {new Date(
                                                                                                      createdAt,
                                                                                                    ).toLocaleString()}
                                                                                                  </small>
                                                                                                )}
                                                                                              </div>

                                                                                              {update.comment && (
                                                                                                <p>
                                                                                                  {
                                                                                                    update.comment
                                                                                                  }
                                                                                                </p>
                                                                                              )}
                                                                                            </div>
                                                                                          );
                                                                                        },
                                                                                      )}
                                                                                    </div>
                                                                                  ) : (
                                                                                    <p
                                                                                      className={
                                                                                        styles.noHistory
                                                                                      }
                                                                                    >
                                                                                      No
                                                                                      progress
                                                                                      updates
                                                                                      have
                                                                                      been
                                                                                      recorded.
                                                                                    </p>
                                                                                  )}
                                                                                </motion.div>
                                                                              )}
                                                                            </AnimatePresence>
                                                                          </div>
                                                                        </div>
                                                                      </>
                                                                    ) : (
                                                                      <p>
                                                                        No
                                                                        progress
                                                                        information
                                                                        available.
                                                                      </p>
                                                                    )}
                                                                  </motion.div>
                                                                )}
                                                              </AnimatePresence>
                                                            </div>
                                                          );
                                                        },
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div
                                                      className={
                                                        styles.emptySmall
                                                      }
                                                    >
                                                      <p>
                                                        No trainee progress is
                                                        available for this task
                                                        yet.
                                                      </p>
                                                    </div>
                                                  )}
                                                </>
                                              )}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}
                            </section>
                          </>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
