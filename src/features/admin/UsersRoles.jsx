import { useEffect, useState } from "react";

import DashboardSidebar from "../../components/DashboardSidebar";
import Button from "../../components/Button";

import { getUsers, updateUserRole, deleteUser } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

function UsersRoles() {
  const { user, token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [roleChanges, setRoleChanges] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      if (!token) return;

      setLoading(true);
      setError("");

      try {
        const usersData = await getUsers(token, { limit: 100 });
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [token]);

  function handleRoleChange(userId, role) {
    setRoleChanges((current) => ({
      ...current,
      [userId]: role,
    }));
  }

  async function handleUpdateRole(userId) {
    if (!token) return;

    const newRole = roleChanges[userId];

    if (!newRole) return;

    setUpdatingUserId(userId);
    setError("");

    try {
      const updatedUser = await updateUserRole(token, userId, newRole);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id ? updatedUser : currentUser
        )
      );

      setRoleChanges((current) => {
        const updated = { ...current };
        delete updated[userId];
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleDeleteUser(userId) {
    if (!token) return;

    if (userId === user?.id) {
      setError("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingUserId(userId);
    setError("");

    try {
      await deleteUser(token, userId);

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== userId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#062b4f]">
              Users & Roles
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage user roles and banking system access.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Users Table */}
          <section className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-[#062b4f]">
                System Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Change user roles or remove users from the banking system.
              </p>
            </div>

            {loading ? (
              <div className="px-5 py-8 text-sm text-slate-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-500">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        User
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((currentUser) => {
                      const selectedRole =
                        roleChanges[currentUser.id] ?? currentUser.role;

                      const hasRoleChange =
                        selectedRole !== currentUser.role;

                      const isCurrentUser = currentUser.id === user?.id;

                      return (
                        <tr key={currentUser.id}>
                          {/* User */}
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-slate-800">
                                {currentUser.first_name}{" "}
                                {currentUser.last_name}
                              </p>

                              <p className="text-sm text-slate-500">
                                {currentUser.email}
                              </p>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <select
                              value={selectedRole}
                              onChange={(event) =>
                                handleRoleChange(
                                  currentUser.id,
                                  event.target.value
                                )
                              }
                              disabled={updatingUserId === currentUser.id}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#062b4f]"
                            >
                              <option value="customer">Customer</option>
                              <option value="teller">Teller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {hasRoleChange && (
                                <Button
                                  onClick={() =>
                                    handleUpdateRole(currentUser.id)
                                  }
                                  disabled={
                                    updatingUserId === currentUser.id
                                  }
                                >
                                  {updatingUserId === currentUser.id
                                    ? "Saving..."
                                    : "Save Role"}
                                </Button>
                              )}

                              <Button
                                onClick={() =>
                                  handleDeleteUser(currentUser.id)
                                }
                                disabled={
                                  isCurrentUser ||
                                  deletingUserId === currentUser.id
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deletingUserId === currentUser.id
                                  ? "Deleting..."
                                  : isCurrentUser
                                  ? "Current User"
                                  : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default UsersRoles;