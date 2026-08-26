import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

function RegisterForm() {
  return (
    <form className="mt-8 space-y-5">
      <Input
        label="Full Name"
        id="fullName"
        name="fullName"
        type="text"
        placeholder="Enter your full name"
      />

      <Input
        label="Email"
        id="registerEmail"
        name="email"
        type="email"
        placeholder="Enter your email"
      />

      <Input
        label="Date of Birth"
        id="dateOfBirth"
        name="dateOfBirth"
        type="date"
      />

      <Input
        label="Password"
        id="registerPassword"
        name="password"
        type="password"
        placeholder="Create a password"
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
      />

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" name="terms" className="mt-1" required />

        <span>
          I agree to the{" "}
          <button
            type="button"
            className="font-medium text-amber-600 hover:underline"
          >
            Terms & Conditions
          </button>
        </span>
      </label>

      <Button type="submit" className="w-full">
        Register
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-amber-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
