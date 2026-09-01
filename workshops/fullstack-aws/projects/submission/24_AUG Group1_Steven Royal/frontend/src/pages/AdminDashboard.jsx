import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "../components/DashboardSidebar";
import Button from "../components/Button";
import { getUsers, getAccounts, getTodaysTransactions, createUser, createAccount } from "../api/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [todaysTransactions, setTodaysTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [createUserForm, setCreateUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    role: "customer",
    password: "",
});

const [creatingUser, setCreatingUser] = useState(false);
const [createUserError, setCreateUserError] = useState("");

//Create Account state
const [showCreateAccount, setShowCreateAccount] = useState(false);

const [createAccountForm, setCreateAccountForm] = useState({
  user_id: "",
  account_type: "checking",
  status: "active",
});

const [creatingAccount, setCreatingAccount] = useState(false);

const [createAccountError, setCreateAccountError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) return;

      setLoading(true);
      setError("");

      try {
        // Get users and accounts from the FastAPI backend.
       //request today's transaction count along with users and accounts
        const [usersData, accountsData, transactionsData] = await Promise.all([
            getUsers(token, { limit: 50 }),
            getAccounts(token),
            getTodaysTransactions(token),
        ]);

        setUsers(usersData);
        setAccounts(accountsData);

        //save today's transaction count
        setTodaysTransactions(transactionsData.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  //Create User
async function handleCreateUser(event) {
  event.preventDefault();

  if (!token) return;

  setCreatingUser(true);
  setCreateUserError("");

  try {
    await createUser(token, createUserForm);

    // Close the modal after successful creation
    setShowCreateUser(false);

    // Reset the form
    setCreateUserForm({
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      role: "customer",
      password: "",
    });

    // Refresh the Recent Users list
    const usersData = await getUsers(token, { limit: 50 });
    setUsers(usersData);
  } catch (err) {
    setCreateUserError(err.message);
  } finally {
    setCreatingUser(false);
  }
}

// Create Account
async function handleCreateAccount(event) {
  event.preventDefault();

  if (!token) return;

  setCreatingAccount(true);
  setCreateAccountError("");

  try {
    // Send the new account to the FastAPI backend.
    await createAccount(token, createAccountForm);

    // Close the modal after successful creation.
    setShowCreateAccount(false);

    // Reset the form.
    setCreateAccountForm({
      user_id: "",
      account_type: "checking",
      status: "active",
    });

    // Refresh the account list and dashboard statistics.
    const accountsData = await getAccounts(token);
    setAccounts(accountsData);
  } catch (err) {
    setCreateAccountError(err.message);
  } finally {
    setCreatingAccount(false);
  }
}

  // CALCULATE DASHBOARD VALUES FROM API DATA

  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalAccounts = accounts.length;

  const activeAccounts = accounts.filter(
    (account) => account.status === "active"
  ).length;

  const frozenAccounts = accounts.filter(
    (account) => account.status === "frozen"
  ).length;

  const closedAccounts = accounts.filter(
    (account) => account.status === "closed"
  ).length;

  
  const recentUsers = users.slice(0, 4);

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

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Statistics */}
          <section className="mb-6">
            <div className="grid gap-4 md:grid-cols-3">

              {/* Total Customers */}
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">
                  Total Customers
                </p>

                <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                  {loading ? "..." : totalCustomers}
                </p>
              </div>

              {/* Total Accounts */}
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">
                  Total Accounts
                </p>

                <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                  {loading ? "..." : totalAccounts}
                </p>
              </div>

              {/* Today's Transactions */}
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">
                  Today's Transactions
                </p>

                <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                    {loading ? "..." : todaysTransactions}
                </p>
              </div>

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

                {loading ? (
                  <div className="px-5 py-6 text-sm text-slate-500">
                    Loading users...
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-500">
                    No users found.
                  </div>
                ) : (
                  recentUsers.map((user) => {

                    const name = `${user.first_name} ${user.last_name}`;

                    const role =
                      user.role?.charAt(0).toUpperCase() +
                      user.role?.slice(1);

                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between px-5 py-4"
                      >
                        <div>
                          <p className="font-medium text-slate-800">
                            {name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {role}
                        </span>
                      </div>
                    );
                  })
                )}

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

                <Button className="w-full"onClick={() => {setCreateUserError("");setShowCreateUser(true);}}>
                    Create User
                </Button>

                <Button className="w-full"onClick={() => {setCreateAccountError("");setShowCreateAccount(true);}}>
                    Create Account
                </Button>

                <Button className="w-full" onClick={() => navigate("/admin/account-management")}>
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

                {/* Active Accounts */}
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Active Accounts
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                    {loading ? "..." : activeAccounts}
                  </p>
                </div>

                {/* Frozen Accounts */}
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Frozen Accounts
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                    {loading ? "..." : frozenAccounts}
                  </p>
                </div>

                {/* Closed Accounts */}
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Closed Accounts
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#062b4f]">
                    {loading ? "..." : closedAccounts}
                  </p>
                </div>

              </div>
            </div>

          </section>

        </div>
      </main>

{/*Create User Modal */}
{showCreateUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

      {/* Modal Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#062b4f]">
          Create User
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new banking system user.
        </p>
      </div>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="space-y-4 p-6">

        {/* Form Error */}
        {createUserError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createUserError}
          </div>
        )}

        {/* First + Last Name */}
        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              First Name
            </label>

            <input
              type="text"
              required
              value={createUserForm.first_name}
              onChange={(event) =>
                setCreateUserForm({
                  ...createUserForm,
                  first_name: event.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Last Name
            </label>

            <input
              type="text"
              required
              value={createUserForm.last_name}
              onChange={(event) =>
                setCreateUserForm({
                  ...createUserForm,
                  last_name: event.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
            />
          </div>

        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            required
            value={createUserForm.email}
            onChange={(event) =>
              setCreateUserForm({
                ...createUserForm,
                email: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date of Birth
          </label>

          <input
            type="date"
            required
            value={createUserForm.dob}
            onChange={(event) =>
              setCreateUserForm({
                ...createUserForm,
                dob: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>

          <select
            value={createUserForm.role}
            onChange={(event) =>
              setCreateUserForm({
                ...createUserForm,
                role: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          >
            <option value="customer">Customer</option>
            <option value="teller">Teller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Temporary Password
          </label>

          <input
            type="password"
            required
            value={createUserForm.password}
            onChange={(event) =>
              setCreateUserForm({
                ...createUserForm,
                password: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">

          <Button
            type="button"
            onClick={() => setShowCreateUser(false)}
            disabled={creatingUser}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={creatingUser}
          >
            {creatingUser ? "Creating..." : "Create User"}
          </Button>

        </div>

      </form>
    </div>
  </div>
)}

    {/* Create Account Modal */}
{showCreateAccount && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

      {/* Modal Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#062b4f]">
          Create Account
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new checking or savings account.
        </p>
      </div>

      {/* Create Account Form */}
      <form onSubmit={handleCreateAccount} className="space-y-4 p-6">

        {/* Form Error */}
        {createAccountError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createAccountError}
          </div>
        )}

        {/* User */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            User
          </label>

          <select
            required
            value={createAccountForm.user_id}
            onChange={(event) =>
              setCreateAccountForm({
                ...createAccountForm,
                user_id: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          >
            <option value="">
              Select a user
            </option>

            {users
                .filter((user) => user.role === "customer").map((user) => (<option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} — {user.email}
                </option>
             ))}
          </select>
        </div>

        {/* Account Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Account Type
          </label>

          <select
            value={createAccountForm.account_type}
            onChange={(event) =>
              setCreateAccountForm({
                ...createAccountForm,
                account_type: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
          >
            <option value="checking">
              Checking
            </option>

            <option value="savings">
              Savings
            </option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">

          <Button
            type="button"
            onClick={() => setShowCreateAccount(false)}
            disabled={creatingAccount}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={creatingAccount}
          >
            {creatingAccount ? "Creating..." : "Create Account"}
          </Button>

        </div>

      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default AdminDashboard;