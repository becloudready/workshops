import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/Button";
import Input from "../../components/Input";
import * as api from "../../api/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await api.forgotPassword(email.trim());
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <div className="auth-form">
        <h2>Check your email</h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-[#062b4f] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2>Reset your password</h2>

      <p className="mt-2 text-sm text-slate-500">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send reset link"}
      </Button>

      <p className="mt-4 text-center text-sm text-slate-500">
        <Link to="/login" className="font-medium text-[#062b4f] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
