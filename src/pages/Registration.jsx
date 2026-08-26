import Logo from "../components/Logo";
import RegisterForm from "../features/auth/RegisterForm";

const FEATURES = [
  {
    icon: "🛡️",
    title: "Bank-grade security",
    description: "Your data is protected with industry-leading encryption.",
  },
  {
    icon: "🔒",
    title: "Secure access",
    description: "Multi-layer authentication keeps your account safe.",
  },
  {
    icon: "👥",
    title: "Trusted by thousands",
    description: "Join thousands of customers who trust us with their money.",
  },
];

function Registration() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-12">
          <Logo />

          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Join TrustPoint Bank today
            </p>

            <RegisterForm />
          </div>
        </div>

        <div className="hidden bg-amber-50 p-12 md:flex md:flex-col md:justify-center">
          <div className="text-center">
            <div className="mb-8 text-6xl">🏦</div>

            <h2 className="text-xl font-semibold text-slate-900">
              Your security is our priority
            </h2>
          </div>

          <div className="mt-8 space-y-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Registration;
