import { useState } from "react";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        {/* Left side */}
        <div className="p-8 md:p-12">
          <h1 className="text-2xl font-bold text-slate-900">TrustPoint Bank</h1>

          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900">
              {isRegistering ? "Create your account" : "Welcome back"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isRegistering
                ? "Join TrustPoint Bank today"
                : "Sign in to your account"}
            </p>

            {isRegistering ? (
              <RegisterForm onSignIn={() => setIsRegistering(false)} />
            ) : (
              <LoginForm onRegister={() => setIsRegistering(true)} />
            )}
          </div>
        </div>

        {/* Right side */}
        {isRegistering ? (
          <div className="hidden bg-amber-50 p-12 md:flex md:flex-col md:justify-center">
            <div className="text-center">
              <div className="mb-8 text-6xl">🏦</div>

              <h2 className="text-xl font-semibold text-slate-900">
                Your security is our priority
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Bank-grade security
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Your data is protected with industry-leading encryption.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Secure access</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Multi-layer authentication keeps your account safe.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Trusted by thousands
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Join thousands of customers who trust us with their money.
                </p>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </section>
    </main>
  );
}

export default AuthPage;
