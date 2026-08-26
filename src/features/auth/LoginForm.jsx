import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

function LoginForm() {
  return (
    <form className="mt-8 space-y-5">
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember me
        </label>

        <button type="button" className="text-blue-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-amber-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
