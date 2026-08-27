import DashboardSidebar from "../components/DashboardSidebar";
import Button from "../components/Button";

function AdminDashboard() {
  const statistics = [
    {
      label: "Total Customers",
      value: "1,245",
    },
    {
      label: "Total Accounts",
      value: "842",
    },
    {
      label: "Today's Transactions",
      value: "2,341",
    },
  ];

  const recentUsers = [
    {
      name: "John Doe",
      role: "Customer",
    },
    {
      name: "Jane Smith",
      role: "Customer",
    },
    {
      name: "Tom Teller",
      role: "Teller",
    },
    {
      name: "Sarah Admin",
      role: "Admin",
    },
  ];

  const accountStatus = [
    {
      label: "Active Accounts",
      value: "742",
    },
    {
      label: "Frozen Accounts",
      value: "68",
    },
    {
      label: "Closed Accounts",
      value: "32",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#062b4f]">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your banking system
            </p>
          </div>

          {/* Statistics */}
          <section className="mb-6">
            <div className="grid gap-4 md:grid-cols-3">
              {statistics.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Users + Quick Actions */}
          <section className="mb-6 grid gap-6 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-[#062b4f]">
                  Recent Users
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recently created users
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {user.role}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-[#062b4f]">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Common administrative actions
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <Button className="w-full">
                  Create User
                </Button>

                <Button className="w-full">
                  Create Account
                </Button>

                <Button className="w-full">
                  Freeze Account
                </Button>

                <Button className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </section>

          {/* Account Status */}
          <section>
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="font-semibold text-[#062b4f]">
                  Account Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current status of all bank accounts
                </p>
              </div>

              <div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {accountStatus.map((status) => (
                  <div key={status.label} className="p-6 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      {status.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                      {status.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;