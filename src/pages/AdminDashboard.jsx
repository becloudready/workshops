import UserManagement from "../features/admin/UserManagement";
import AccountManagement from "../features/admin/AccountManagement";

function AdminDashboard() {
<<<<<<< HEAD
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>

                    <button
                        type="button"
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Admin ▼
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="min-h-[calc(100vh-73px)] w-64 border-r bg-white p-4">
                    <nav className="space-y-2">
                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left font-medium"
                        >
                            Dashboard
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Customers
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Accounts
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Transactions
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Users & Roles
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Reports
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                        >
                            Settings
                        </button>

                        <div className="pt-4">
                            <button
                                type="button"
                                className="w-full rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Statistics */}
                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            Overview
                        </h2>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    Total Customers
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    1,245
                                </p>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    Total Accounts
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    842
                                </p>
                            </div>

                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-gray-500">
                                    Today's Transactions
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    2,341
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Recent Users + Quick Actions */}
                    <section className="mt-8 grid gap-6 lg:grid-cols-2">
                        {/* Recent Users */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Recent Users
                                </h2>

                                <button
                                    type="button"
                                    className="text-sm font-medium"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            John Doe
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            john@example.com
                                        </p>
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        Customer
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Jane Smith
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            jane@example.com
                                        </p>
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        Customer
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Tom Teller
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            tom@bank.com
                                        </p>
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        Teller
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-xl font-semibold text-gray-900">
                                Quick Actions
                            </h2>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    className="rounded-lg border px-4 py-4 text-left font-medium hover:bg-gray-50"
                                >
                                    + Create User
                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg border px-4 py-4 text-left font-medium hover:bg-gray-50"
                                >
                                    + Create Account
                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg border px-4 py-4 text-left font-medium hover:bg-gray-50"
                                >
                                    Freeze Account
                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg border px-4 py-4 text-left font-medium hover:bg-gray-50"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Account Status */}
                    <section className="mt-8">
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-xl font-semibold text-gray-900">
                                Account Status
                            </h2>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Active Accounts
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        742
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Frozen Accounts
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        68
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Closed Accounts
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        32
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
=======
  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">Manage users, staff, and accounts.</p>
      </div>

      <div className="space-y-8">
        <UserManagement />

        <AccountManagement />
      </div>
    </div>
  );
>>>>>>> main
}

export default AdminDashboard;
