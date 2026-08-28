import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import { useAuth } from "../../context/AuthContext";

const ROLE_HOME = {
  customer: "/customer",
  teller: "/teller",
  admin: "/admin",
};

const EMPTY_FORM = {
  fullName: "",
  email: "",
  dob: "",
  password: "",
  confirmPassword: "",
};

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" "),
  };
}

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function validate() {
    const { first_name, last_name } = splitFullName(form.fullName);
    if (!first_name || !last_name) return "Enter your first and last name.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (!form.dob) return "Date of birth is required.";
    if (!agreedToTerms) return "You must agree to the Terms & Conditions.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      // confirmPassword and agreedToTerms are client-side checks only, not sent to the API.
      const { first_name, last_name } = splitFullName(form.fullName);
      const user = await register({
        first_name,
        last_name,
        email: form.email.trim(),
        dob: form.dob,
        password: form.password,
      });
      navigate(ROLE_HOME[user.role] ?? "/customer", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Full Name"
        name="fullName"
        placeholder="Enter your full name"
        autoComplete="name"
        value={form.fullName}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Date of Birth"
        type="date"
        name="dob"
        autoComplete="bday"
        value={form.dob}
        onChange={handleChange}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Create a password"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(event) => setAgreedToTerms(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#062b4f] focus:ring-[#062b4f]/30"
        />
        I agree to the Terms &amp; Conditions
      </label>

      <Button type="submit" disabled={submitting} className="w-full py-3">
        {submitting ? "Creating account…" : "Register"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[#062b4f] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
