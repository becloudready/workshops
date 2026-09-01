import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./Login.module.css";

import { setCredentials } from "../store/TraineeSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function Login({ onLogin }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      console.log("========== LOGIN REQUEST ==========");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Status:", response.status);
      console.log("OK:", response.ok);

      const data = await response.json();

      console.log("Response Data:", data);

      // --------------------------------
      // Handle errors
      // --------------------------------

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const messages = data.detail
            .map((validationError) => {
              const field =
                validationError.loc?.[validationError.loc.length - 1];

              const message = validationError.msg || "Invalid value";

              return field ? `${field}: ${message}` : message;
            })
            .join(", ");

          throw new Error(messages);
        }

        if (typeof data.detail === "string") {
          throw new Error(data.detail);
        }

        throw new Error(`Login failed with status ${response.status}`);
      }

      // --------------------------------
      // Validate login response
      // --------------------------------

      if (!data.accessToken) {
        throw new Error("Login succeeded, but no access token was returned.");
      }

      if (!data.role) {
        throw new Error("Login succeeded, but no role was returned.");
      }

      if (!data.userId) {
        throw new Error("Login succeeded, but no user ID was returned.");
      }

      // --------------------------------
      // Save login information to Redux
      // --------------------------------

      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          tokenType: data.tokenType,
          role: data.role,
          userId: data.userId,
        }),
      );

      console.log("========== LOGIN SUCCESS ==========");
      console.log("User ID:", data.userId);
      console.log("Role:", data.role);
      console.log("Token Type:", data.tokenType);
      console.log("Access Token Received:", !!data.accessToken);
      console.log("===================================");

      // --------------------------------
      // Tell App.jsx login succeeded
      // --------------------------------

      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error("========== LOGIN ERROR ==========");
      console.error(error);
      console.error("=================================");

      setError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header */}

        <div className={styles.header}>
          <p className={styles.label}>C.B.M.H.</p>

          <h1>Welcome Back</h1>

          <p>Sign in to access your trainee task board.</p>
        </div>

        {/* Login Form */}

        <form onSubmit={handleSubmit}>
          {/* Email */}

          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email / manager@noticeboardtracker.dev /
              trainee1@noticeboardtracker.dev
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}

          <div className={styles.inputGroup}>
            <label htmlFor="password">
              Password / Manager123! / Trainee123!
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Error */}

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {/* Submit */}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
