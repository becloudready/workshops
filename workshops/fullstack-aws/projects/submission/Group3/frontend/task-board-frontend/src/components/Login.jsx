import { useState } from "react";
import styles from "./Login.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
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

      const data = await response.json();

      // Handle FastAPI validation errors
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

        // Handle normal FastAPI errors
        if (typeof data.detail === "string") {
          throw new Error(data.detail);
        }

        throw new Error(`Login failed with status ${response.status}`);
      }

      // Make sure the backend actually returned a token
      if (!data.access_token) {
        throw new Error("Login succeeded, but no access token was returned.");
      }

      // Store authentication information
      localStorage.setItem("access_token", data.access_token);

      localStorage.setItem("role", data.role);

      localStorage.setItem("user_id", data.user_id);

      console.log("Login successful");

      // Tell App.jsx that the user is now logged in
      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error("Login failed:", error);

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
            <label htmlFor="email">Email</label>

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
            <label htmlFor="password">Password</label>

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
