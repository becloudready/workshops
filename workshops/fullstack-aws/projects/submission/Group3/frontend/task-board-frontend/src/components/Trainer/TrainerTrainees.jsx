import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TrainerTrainees.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ENDPOINTS = {
  trainees: `${API_BASE_URL}/manager/trainees`,
  trainee: (traineeId) => `${API_BASE_URL}/manager/trainees/${traineeId}`,
  cohorts: `${API_BASE_URL}/manager/cohorts`,
  task: (taskId) => `${API_BASE_URL}/manager/tasks/${taskId}`,
  traineeProgress: (taskId, traineeId) =>
    `${API_BASE_URL}/manager/tasks/${taskId}/progress/${traineeId}`,
};

export default function TrainerTrainees() {
  const { accessToken, tokenType, isAuthenticated } = useSelector(
    (state) => state.trainee,
  );

  const [trainees, setTrainees] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const [expandedTraineeId, setExpandedTraineeId] = useState(null);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(null);

  const [progressUpdatesOpen, setProgressUpdatesOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    cohortId: "",
  });

  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    cohortId: "",
  });

  const [loading, setLoading] = useState(true);
  const [traineeLoading, setTraineeLoading] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState(null);

  function getAuthHeaders() {
    if (!accessToken) {
      throw new Error("You are not logged in.");
    }

    return {
      Authorization: `${tokenType || "Bearer"} ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

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
  // FETCH TRAINEES
  // ============================================================

  async function fetchTrainees() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ENDPOINTS.trainees, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(
        response,
        `Failed to fetch trainees: ${response.status}`,
      );

      setTrainees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching trainees:", err);

      setError(err instanceof Error ? err.message : "Unable to load trainees.");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // FETCH COHORTS
  // ============================================================

  async function fetchCohorts() {
    try {
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
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }

    fetchTrainees();
    fetchCohorts();
  }, [accessToken, tokenType, isAuthenticated]);

  // ============================================================
  // FETCH SINGLE TRAINEE
  // ============================================================

  async function fetchTrainee(traineeId) {
    try {
      setTraineeLoading(true);
      setError(null);

      const response = await fetch(ENDPOINTS.trainee(traineeId), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(
        response,
        `Failed to fetch trainee: ${response.status}`,
      );

      setSelectedTrainee(data);
    } catch (err) {
      console.error("Error fetching trainee:", err);

      setError(err instanceof Error ? err.message : "Unable to load trainee.");
    } finally {
      setTraineeLoading(false);
    }
  }

  // ============================================================
  // TRAINEE CLICK
  // ============================================================

  function handleTraineeClick(traineeId) {
    if (expandedTraineeId === traineeId) {
      setExpandedTraineeId(null);
      setSelectedTrainee(null);
      setExpandedTaskId(null);
      setSelectedTask(null);
      setTaskProgress(null);
      setProgressUpdatesOpen(false);
      setEditOpen(false);
      return;
    }

    setExpandedTraineeId(traineeId);
    setSelectedTrainee(null);
    setExpandedTaskId(null);
    setSelectedTask(null);
    setTaskProgress(null);
    setProgressUpdatesOpen(false);
    setEditOpen(false);

    fetchTrainee(traineeId);
  }

  // ============================================================
  // CREATE FORM
  // ============================================================

  function updateCreateForm(field, value) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetCreateForm() {
    setCreateForm({
      fullName: "",
      email: "",
      password: "",
      cohortId: "",
    });
  }

  // ============================================================
  // CREATE TRAINEE
  // ============================================================

  async function createTrainee(event) {
    event.preventDefault();

    if (!createForm.fullName.trim()) {
      setError("Trainee name is required.");
      return;
    }

    if (!createForm.email.trim()) {
      setError("Trainee email is required.");
      return;
    }

    if (!createForm.password) {
      setError("Trainee password is required.");
      return;
    }

    if (createForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch(ENDPOINTS.trainees, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName: createForm.fullName.trim(),
          email: createForm.email.trim(),
          password: createForm.password,
          cohortId: createForm.cohortId ? Number(createForm.cohortId) : null,
        }),
      });

      const createdTrainee = await handleResponse(
        response,
        `Failed to create trainee: ${response.status}`,
      );

      resetCreateForm();
      setCreateOpen(false);

      if (createdTrainee) {
        setTrainees((current) => [
          ...current,
          {
            id: createdTrainee.id,
            fullName: createdTrainee.fullName,
            email: createdTrainee.email,
            cohort: createdTrainee.cohort ?? null,
          },
        ]);
      } else {
        await fetchTrainees();
      }
    } catch (err) {
      console.error("Error creating trainee:", err);

      setError(
        err instanceof Error ? err.message : "Unable to create trainee.",
      );
    } finally {
      setCreating(false);
    }
  }

  // ============================================================
  // EDIT TRAINEE
  // ============================================================

  function openEditTrainee() {
    if (!selectedTrainee) {
      return;
    }

    setEditForm({
      fullName: selectedTrainee.fullName ?? "",
      email: selectedTrainee.email ?? "",
      cohortId: selectedTrainee.cohort?.id
        ? String(selectedTrainee.cohort.id)
        : "",
    });

    setEditOpen(true);
    setError(null);
  }

  function updateEditForm(field, value) {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function cancelEdit() {
    setEditOpen(false);
  }

  // ============================================================
  // UPDATE TRAINEE
  // ============================================================

  async function updateTrainee(event) {
    event.preventDefault();

    if (!selectedTrainee) {
      return;
    }

    if (!editForm.fullName.trim()) {
      setError("Trainee name is required.");
      return;
    }

    if (!editForm.email.trim()) {
      setError("Trainee email is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const traineeId = selectedTrainee.id;

      const response = await fetch(ENDPOINTS.trainee(traineeId), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName: editForm.fullName.trim(),
          email: editForm.email.trim(),
          cohortId: editForm.cohortId ? Number(editForm.cohortId) : null,
        }),
      });

      const updatedTrainee = await handleResponse(
        response,
        `Failed to update trainee: ${response.status}`,
      );

      setEditOpen(false);

      if (updatedTrainee) {
        setSelectedTrainee(updatedTrainee);

        setTrainees((current) =>
          current.map((trainee) =>
            trainee.id === updatedTrainee.id
              ? {
                  ...trainee,
                  id: updatedTrainee.id,
                  fullName: updatedTrainee.fullName,
                  email: updatedTrainee.email,
                  cohort: updatedTrainee.cohort ?? null,
                }
              : trainee,
          ),
        );
      } else {
        await fetchTrainee(traineeId);
        await fetchTrainees();
      }
    } catch (err) {
      console.error("Error updating trainee:", err);

      setError(
        err instanceof Error ? err.message : "Unable to update trainee.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE TRAINEE
  // ============================================================

  async function deleteTrainee() {
    if (!selectedTrainee) {
      return;
    }

    const traineeId = selectedTrainee.id;
    const traineeName = getTraineeName(selectedTrainee);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${traineeName}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(ENDPOINTS.trainee(traineeId), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      await handleResponse(
        response,
        `Failed to delete trainee: ${response.status}`,
      );

      setTrainees((current) =>
        current.filter((trainee) => trainee.id !== traineeId),
      );

      setExpandedTraineeId(null);
      setSelectedTrainee(null);
      setExpandedTaskId(null);
      setSelectedTask(null);
      setTaskProgress(null);
      setProgressUpdatesOpen(false);
      setEditOpen(false);
    } catch (err) {
      console.error("Error deleting trainee:", err);

      setError(
        err instanceof Error ? err.message : "Unable to delete trainee.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // FETCH TASK PROGRESS
  // ============================================================

  async function fetchTaskProgress(taskId) {
    if (!selectedTrainee) {
      return;
    }

    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setSelectedTask(null);
      setTaskProgress(null);
      setProgressUpdatesOpen(false);
      return;
    }

    try {
      setExpandedTaskId(taskId);
      setSelectedTask(null);
      setTaskProgress(null);
      setProgressUpdatesOpen(false);
      setProgressLoading(true);
      setError(null);

      const [taskResponse, progressResponse] = await Promise.all([
        fetch(ENDPOINTS.task(taskId), {
          method: "GET",
          headers: getAuthHeaders(),
        }),

        fetch(ENDPOINTS.traineeProgress(taskId, selectedTrainee.id), {
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
        `Failed to fetch trainee progress: ${progressResponse.status}`,
      );

      setSelectedTask(taskData);
      setTaskProgress(progressData);
    } catch (err) {
      console.error("Error fetching task progress:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load task progress.",
      );
    } finally {
      setProgressLoading(false);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function getTraineeName(trainee) {
    return trainee.fullName ?? trainee.full_name ?? `Trainee ${trainee.id}`;
  }

  function getCohortName(trainee) {
    return trainee.cohort?.name ?? "No cohort";
  }

  function getTaskPercentage(task) {
    return Math.min(
      100,
      Math.max(
        0,
        Number(task.currentPercentage ?? task.current_percentage ?? 0),
      ),
    );
  }

  function getUrgencyClass(urgency) {
    if (!urgency) {
      return "";
    }

    const normalized = urgency.toString().toLowerCase();

    const className = `urgency${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;

    return styles[className] || "";
  }

  // ============================================================
  // PROGRESS UPDATES
  // ============================================================

  function renderProgressUpdates() {
    const history = taskProgress?.history || [];

    return (
      <div className={styles.progressUpdatesDropdown}>
        <button
          type="button"
          className={styles.progressUpdatesButton}
          onClick={() => setProgressUpdatesOpen((current) => !current)}
          aria-expanded={progressUpdatesOpen}
        >
          <div className={styles.progressUpdatesButtonText}>
            <div className={styles.progressUpdatesIcon}>↗</div>

            <div>
              <strong>Progress Updates</strong>

              <span>
                {history.length} {history.length === 1 ? "update" : "updates"}
              </span>
            </div>
          </div>

          <motion.span
            className={styles.progressUpdatesArrow}
            animate={{
              rotate: progressUpdatesOpen ? 180 : 0,
            }}
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {progressUpdatesOpen && (
            <motion.div
              className={styles.progressUpdatesDropdownContent}
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
              <div className={styles.progressUpdatesDropdownInner}>
                {history.length > 0 ? (
                  <div className={styles.progressUpdateList}>
                    {history.map((update, index) => (
                      <div
                        key={update.id ?? index}
                        className={styles.progressUpdate}
                      >
                        <div className={styles.progressUpdateTimeline}>
                          <div className={styles.progressUpdateDot} />
                        </div>

                        <div className={styles.progressUpdateBody}>
                          <div className={styles.progressUpdateHeader}>
                            <strong>{Number(update.percentage ?? 0)}%</strong>

                            {update.created_at && (
                              <span>
                                {new Date(update.created_at).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {update.comment && <p>{update.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noProgressUpdates}>
                    No progress updates yet.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className={styles.status}>
        <div className={styles.loadingSpinner} />
        <p>Loading trainees...</p>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error && trainees.length === 0) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>!</div>
        <h2>Unable to load trainees</h2>
        <p>{error}</p>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.container}>
      {/* HEADER */}

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <p className={styles.eyebrow}>TRAINER DASHBOARD</p>

            <h1>Trainees</h1>

            <p className={styles.headerDescription}>
              Manage your trainees, review their assigned tasks, and monitor
              progress.
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.countBadge}>
              <span className={styles.countDot} />

              <span>
                {trainees.length}{" "}
                {trainees.length === 1 ? "trainee" : "trainees"}
              </span>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                setCreateOpen((current) => !current);
                setEditOpen(false);
                setError(null);
              }}
            >
              <span className={styles.buttonIcon}>
                {createOpen ? "×" : "+"}
              </span>

              {createOpen ? "Cancel" : "New Trainee"}
            </button>
          </div>
        </div>
      </header>

      {/* ERROR */}

      <AnimatePresence>
        {error && (
          <motion.div
            className={styles.errorBanner}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span className={styles.errorBannerIcon}>!</span>
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE */}

      <AnimatePresence initial={false}>
        {createOpen && (
          <motion.section
            className={styles.createPanel}
            initial={{
              height: 0,
              opacity: 0,
              y: -10,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              y: 0,
            }}
            exit={{
              height: 0,
              opacity: 0,
              y: -10,
            }}
          >
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>TRAINEE MANAGEMENT</p>

                <h2>Create New Trainee</h2>

                <p>
                  Add a trainee now and assign them to a cohort later if needed.
                </p>
              </div>

              <div className={styles.panelIcon}>+</div>
            </div>

            <form className={styles.formGrid} onSubmit={createTrainee}>
              <div className={styles.formGroup}>
                <label htmlFor="new-trainee-name">Full Name</label>

                <input
                  id="new-trainee-name"
                  type="text"
                  value={createForm.fullName}
                  onChange={(event) =>
                    updateCreateForm("fullName", event.target.value)
                  }
                  placeholder="Enter trainee name"
                  disabled={creating}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-trainee-email">Email Address</label>

                <input
                  id="new-trainee-email"
                  type="email"
                  value={createForm.email}
                  onChange={(event) =>
                    updateCreateForm("email", event.target.value)
                  }
                  placeholder="trainee@example.com"
                  disabled={creating}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-trainee-password">Temporary Password</label>

                <input
                  id="new-trainee-password"
                  type="password"
                  value={createForm.password}
                  onChange={(event) =>
                    updateCreateForm("password", event.target.value)
                  }
                  placeholder="Enter temporary password"
                  disabled={creating}
                  minLength={8}
                  required
                />

                <span className={styles.formHint}>
                  Must contain at least 8 characters.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-trainee-cohort">
                  Cohort <span>(optional)</span>
                </label>

                <select
                  id="new-trainee-cohort"
                  value={createForm.cohortId}
                  onChange={(event) =>
                    updateCreateForm("cohortId", event.target.value)
                  }
                  disabled={creating}
                >
                  <option value="">No cohort</option>

                  {cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>

                <span className={styles.formHint}>
                  You can assign this trainee to a cohort later.
                </span>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    resetCreateForm();
                    setCreateOpen(false);
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Trainee"}
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* TRAINEES */}

      <main className={styles.traineeList}>
        {trainees.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>◎</div>

            <h2>No trainees yet</h2>

            <p>There are currently no trainees to display.</p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setCreateOpen(true)}
            >
              <span className={styles.buttonIcon}>+</span>
              Add First Trainee
            </button>
          </div>
        ) : (
          trainees.map((trainee) => {
            const traineeId = trainee.id;
            const isOpen = expandedTraineeId === traineeId;

            return (
              <motion.article
                key={traineeId}
                layout
                className={`${styles.traineeCard} ${
                  isOpen ? styles.traineeCardOpen : ""
                }`}
              >
                {/* TRAINEE HEADER */}

                <button
                  type="button"
                  className={styles.traineeHeader}
                  onClick={() => handleTraineeClick(traineeId)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.traineeIdentity}>
                    <div className={styles.avatar}>
                      {getTraineeName(trainee).charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.identityText}>
                      <div className={styles.identityTop}>
                        <p className={styles.eyebrow}>TRAINEE</p>

                        <span className={styles.cohortBadge}>
                          {getCohortName(trainee)}
                        </span>
                      </div>

                      <h2>{getTraineeName(trainee)}</h2>

                      {trainee.email && (
                        <p className={styles.email}>{trainee.email}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.expandButton}>
                    <motion.span
                      animate={{
                        rotate: isOpen ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      ↓
                    </motion.span>
                  </div>
                </button>

                {/* TRAINEE CONTENT */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.traineeContent}
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
                      <div className={styles.traineeInner}>
                        {traineeLoading ? (
                          <div className={styles.loadingInline}>
                            <div className={styles.loadingSpinner} />
                            Loading trainee...
                          </div>
                        ) : selectedTrainee ? (
                          <>
                            {/* PROFILE */}

                            <section className={styles.section}>
                              <div className={styles.sectionHeader}>
                                <div>
                                  <p className={styles.eyebrow}>
                                    TRAINEE INFORMATION
                                  </p>

                                  <h3>Profile</h3>
                                </div>

                                {!editOpen && (
                                  <div className={styles.profileActions}>
                                    <button
                                      type="button"
                                      className={styles.secondaryButton}
                                      onClick={openEditTrainee}
                                      disabled={saving}
                                    >
                                      Edit Profile
                                    </button>

                                    <button
                                      type="button"
                                      className={styles.deleteButton}
                                      onClick={deleteTrainee}
                                      disabled={saving}
                                    >
                                      {saving
                                        ? "Deleting..."
                                        : "Delete Trainee"}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {!editOpen ? (
                                <div className={styles.infoGrid}>
                                  <div className={styles.infoCard}>
                                    <span>Name</span>

                                    <strong>
                                      {getTraineeName(selectedTrainee)}
                                    </strong>
                                  </div>

                                  <div className={styles.infoCard}>
                                    <span>Email</span>

                                    <strong>
                                      {selectedTrainee.email || "—"}
                                    </strong>
                                  </div>

                                  <div className={styles.infoCard}>
                                    <span>Cohort</span>

                                    <strong>
                                      {getCohortName(selectedTrainee)}
                                    </strong>
                                  </div>

                                  <div className={styles.infoCard}>
                                    <span>Trainee ID</span>

                                    <strong>#{selectedTrainee.id}</strong>
                                  </div>
                                </div>
                              ) : (
                                <form
                                  className={styles.formGrid}
                                  onSubmit={updateTrainee}
                                >
                                  <div className={styles.formGroup}>
                                    <label htmlFor="edit-trainee-name">
                                      Full Name
                                    </label>

                                    <input
                                      id="edit-trainee-name"
                                      type="text"
                                      value={editForm.fullName}
                                      onChange={(event) =>
                                        updateEditForm(
                                          "fullName",
                                          event.target.value,
                                        )
                                      }
                                      disabled={saving}
                                      required
                                    />
                                  </div>

                                  <div className={styles.formGroup}>
                                    <label htmlFor="edit-trainee-email">
                                      Email Address
                                    </label>

                                    <input
                                      id="edit-trainee-email"
                                      type="email"
                                      value={editForm.email}
                                      onChange={(event) =>
                                        updateEditForm(
                                          "email",
                                          event.target.value,
                                        )
                                      }
                                      disabled={saving}
                                      required
                                    />
                                  </div>

                                  <div className={styles.formGroup}>
                                    <label htmlFor="edit-trainee-cohort">
                                      Cohort <span>(optional)</span>
                                    </label>

                                    <select
                                      id="edit-trainee-cohort"
                                      value={editForm.cohortId}
                                      onChange={(event) =>
                                        updateEditForm(
                                          "cohortId",
                                          event.target.value,
                                        )
                                      }
                                      disabled={saving}
                                    >
                                      <option value="">No cohort</option>

                                      {cohorts.map((cohort) => (
                                        <option
                                          key={cohort.id}
                                          value={cohort.id}
                                        >
                                          {cohort.name}
                                        </option>
                                      ))}
                                    </select>

                                    <span className={styles.formHint}>
                                      Select "No cohort" to remove the trainee
                                      from their current cohort.
                                    </span>
                                  </div>

                                  <div className={styles.formActions}>
                                    <button
                                      type="button"
                                      className={styles.secondaryButton}
                                      onClick={cancelEdit}
                                      disabled={saving}
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="submit"
                                      className={styles.primaryButton}
                                      disabled={saving}
                                    >
                                      {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                  </div>
                                </form>
                              )}
                            </section>

                            {/* TASKS */}

                            <section className={styles.section}>
                              <div className={styles.sectionHeader}>
                                <div>
                                  <p className={styles.eyebrow}>
                                    TRAINEE TASKS
                                  </p>

                                  <h3>Assigned Tasks</h3>
                                </div>

                                <span className={styles.sectionCount}>
                                  {(selectedTrainee.tasks || []).length}
                                </span>
                              </div>

                              {!selectedTrainee.tasks?.length ? (
                                <div className={styles.emptySmall}>
                                  <div className={styles.emptySmallIcon}>✓</div>

                                  <div>
                                    <strong>No tasks assigned</strong>

                                    <p>
                                      This trainee does not have any assigned
                                      tasks yet.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.taskList}>
                                  {selectedTrainee.tasks.map((task) => {
                                    const isSelected =
                                      expandedTaskId === task.id;

                                    const percentage = getTaskPercentage(task);

                                    return (
                                      <motion.div
                                        key={task.id}
                                        layout
                                        className={`${styles.taskCard} ${
                                          isSelected ? styles.taskCardOpen : ""
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          className={styles.taskButton}
                                          onClick={() =>
                                            fetchTaskProgress(task.id)
                                          }
                                        >
                                          <div className={styles.taskTop}>
                                            <div className={styles.taskNumber}>
                                              {String(task.id).padStart(2, "0")}
                                            </div>

                                            <div className={styles.taskMain}>
                                              <div
                                                className={styles.taskTitleRow}
                                              >
                                                <h4>{task.title}</h4>

                                                {task.urgency && (
                                                  <span
                                                    className={`${styles.urgency} ${getUrgencyClass(
                                                      task.urgency,
                                                    )}`}
                                                  >
                                                    {task.urgency}
                                                  </span>
                                                )}
                                              </div>

                                              {task.description && (
                                                <p
                                                  className={
                                                    styles.taskDescription
                                                  }
                                                >
                                                  {task.description}
                                                </p>
                                              )}
                                            </div>

                                            <motion.span
                                              className={styles.taskArrow}
                                              animate={{
                                                rotate: isSelected ? 180 : 0,
                                              }}
                                            >
                                              ↓
                                            </motion.span>
                                          </div>

                                          <div
                                            className={styles.progressWrapper}
                                          >
                                            <div
                                              className={styles.progressLabel}
                                            >
                                              <span>Progress</span>

                                              <strong>{percentage}%</strong>
                                            </div>

                                            <div
                                              className={styles.progressTrack}
                                            >
                                              <motion.div
                                                className={styles.progressBar}
                                                initial={{
                                                  width: 0,
                                                }}
                                                animate={{
                                                  width: `${percentage}%`,
                                                }}
                                                transition={{
                                                  duration: 0.7,
                                                  ease: "easeOut",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </button>

                                        <div className={styles.taskFooter}>
                                          <div>
                                            {task.dueDate ? (
                                              <>
                                                <span
                                                  className={styles.footerLabel}
                                                >
                                                  Due
                                                </span>

                                                {new Date(
                                                  task.dueDate,
                                                ).toLocaleDateString()}
                                              </>
                                            ) : (
                                              <span
                                                className={styles.noDueDate}
                                              >
                                                No due date
                                              </span>
                                            )}
                                          </div>

                                          <span className={styles.viewProgress}>
                                            {isSelected
                                              ? "Hide Progress"
                                              : "View Progress"}

                                            <span>→</span>
                                          </span>
                                        </div>

                                        {/* TASK DETAILS */}

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
                                              {progressLoading ? (
                                                <div
                                                  className={
                                                    styles.progressLoading
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.loadingSpinner
                                                    }
                                                  />
                                                  Loading progress...
                                                </div>
                                              ) : taskProgress ? (
                                                <div
                                                  className={
                                                    styles.progressContent
                                                  }
                                                >
                                                  {/* SUBTASKS */}

                                                  {taskProgress.subtasks
                                                    ?.length > 0 && (
                                                    <div
                                                      className={
                                                        styles.subtasks
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.detailHeader
                                                        }
                                                      >
                                                        <div>
                                                          <p
                                                            className={
                                                              styles.eyebrow
                                                            }
                                                          >
                                                            TASK BREAKDOWN
                                                          </p>

                                                          <h4>Subtasks</h4>
                                                        </div>

                                                        <span>
                                                          {
                                                            taskProgress
                                                              .subtasks.length
                                                          }
                                                        </span>
                                                      </div>

                                                      <div
                                                        className={
                                                          styles.subtaskList
                                                        }
                                                      >
                                                        {taskProgress.subtasks.map(
                                                          (subtask) => {
                                                            const isCompleted =
                                                              subtask.isCompleted ??
                                                              subtask.is_completed ??
                                                              false;

                                                            return (
                                                              <div
                                                                key={subtask.id}
                                                                className={
                                                                  styles.subtaskItem
                                                                }
                                                              >
                                                                <div
                                                                  className={`${styles.subtaskCheck} ${
                                                                    isCompleted
                                                                      ? styles.subtaskCheckCompleted
                                                                      : ""
                                                                  }`}
                                                                >
                                                                  {isCompleted
                                                                    ? "✓"
                                                                    : ""}
                                                                </div>

                                                                <strong>
                                                                  {
                                                                    subtask.title
                                                                  }
                                                                </strong>

                                                                <span
                                                                  className={
                                                                    isCompleted
                                                                      ? styles.subtaskCompleted
                                                                      : styles.subtaskIncomplete
                                                                  }
                                                                >
                                                                  {isCompleted
                                                                    ? "Completed"
                                                                    : "Incomplete"}
                                                                </span>
                                                              </div>
                                                            );
                                                          },
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* PROGRESS UPDATES */}

                                                  {renderProgressUpdates()}

                                                  {/* DESCRIPTION */}

                                                  {selectedTask?.description && (
                                                    <div
                                                      className={
                                                        styles.progressDetails
                                                      }
                                                    >
                                                      <p
                                                        className={
                                                          styles.eyebrow
                                                        }
                                                      >
                                                        TASK DESCRIPTION
                                                      </p>

                                                      <p>
                                                        {
                                                          selectedTask.description
                                                        }
                                                      </p>
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                <div
                                                  className={styles.noProgress}
                                                >
                                                  No progress information
                                                  available.
                                                </div>
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
              </motion.article>
            );
          })
        )}
      </main>
    </div>
  );
}
