function AuthPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-2">
        <div className="p-8 md:p-12">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900">
              TrustPoint Bank
            </h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your account
            </p>

            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Login form will go here
            </div>
          </div>
        </div>

        <div className="hidden bg-slate-900 p-12 text-white md:flex md:flex-col md:items-center md:justify-center">
          <div className="text-center">
            <div className="mb-6 text-6xl font-bold text-amber-400">TP</div>

            <h2 className="text-2xl font-semibold text-amber-400">
              Banking made simple.
              <br />
              Built on trust.
            </h2>

            <p className="mt-4 text-sm text-slate-300">
              Secure. Reliable. Personal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
