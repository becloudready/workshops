import ResetPasswordForm from "../features/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <h1 className="text-2xl font-bold text-slate-900">TrustPoint Bank</h1>

        <div className="mt-10">
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;
