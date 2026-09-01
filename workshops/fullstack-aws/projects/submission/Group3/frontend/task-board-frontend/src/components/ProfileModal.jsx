import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProfileModal.module.css";

import { setName as setTraineeName } from "../store/TraineeSlice";
import { setName as setTrainerName } from "../store/TrainerSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Backend only stores a single full_name column - split/join here
// rather than migrating to first_name/last_name, which would touch
// every place that already reads full_name (task progress views,
// trainee lists, the seed script, etc).
function splitName(fullName) {
  const trimmed = (fullName || "").trim();

  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const [first, ...rest] = trimmed.split(" ");

  return { firstName: first, lastName: rest.join(" ") };
}

export default function ProfileModal({ onClose }) {
  const dispatch = useDispatch();

  const { accessToken, tokenType, role } = useSelector(
    (state) => state.trainee,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function getAuthHeaders() {
    return {
      Authorization: `${tokenType || "Bearer"} ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to load your profile.");
        }

        const data = await response.json();
        const { firstName: fn, lastName: ln } = splitName(data.fullName);

        setFirstName(fn);
        setLastName(ln);
        setEmail(data.email || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    if (newPassword && !currentPassword) {
      setError("Enter your current password to set a new one.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update your profile.");
      }

      if (role === "manager") {
        dispatch(setTrainerName(data.fullName));
      } else {
        dispatch(setTraineeName(data.fullName));
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className={styles.header}>
          <h2 id="profile-modal-title">Profile Settings</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading your profile...</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="profile-first-name">First Name</label>

                <input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="profile-last-name">Last Name</label>

                <input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="profile-email">Email</label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.divider}>
              <span>Change Password (optional)</span>
            </div>

            <div className={styles.field}>
              <label htmlFor="profile-current-password">
                Current Password
              </label>

              <input
                id="profile-current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Only required if setting a new password"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="profile-new-password">New Password</label>

                <input
                  id="profile-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="profile-confirm-password">
                  Confirm New Password
                </label>

                <input
                  id="profile-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            {success && <div className={styles.success}>Profile updated.</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
