import LoginForm from "../features/auth/LoginForm";

function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-12">
          <h1 className="text-2xl font-bold text-slate-900">TrustPoint Bank</h1>

          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your account
            </p>

            <LoginForm />
          </div>
        </div>

        <div className="hidden bg-[#062b4f] p-12 text-white md:flex md:flex-col md:items-center md:justify-center">
          <div className="text-center">
            <div className="mb-6 text-6xl font-bold text-amber-400">TP</div>

            <h2 className="text-2xl font-semibold text-amber-400">
              Banking made simple.
              <br />
              Built on trust.
            </h2>

            <p className="mt-4 text-sm text-slate-200">
              Secure. Reliable. Personal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
