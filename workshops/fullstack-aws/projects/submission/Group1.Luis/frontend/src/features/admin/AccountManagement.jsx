import { useEffect, useState } from "react";

import DashboardSidebar from "../../components/DashboardSidebar";
import Button from "../../components/Button";

import {
  getAccounts,
  freezeAccount,
  unfreezeAccount,
} from "../../api/api";

import { useAuth } from "../../context/AuthContext";

function AccountManagement() {
  const { token } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAccountId, setUpdatingAccountId] = useState(null);

  useEffect(() => {
    async function loadAccounts() {
      if (!token) return;

      setLoading(true);
      setError("");

      try {
        const accountsData = await getAccounts(token);
        setAccounts(accountsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, [token]);

  async function handleFreeze(accountId) {
    if (!token) return;

    setUpdatingAccountId(accountId);
    setError("");

    try {
      const updatedAccount = await freezeAccount(token, accountId);

      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingAccountId(null);
    }
  }

  async function handleUnfreeze(accountId) {
    if (!token) return;

    setUpdatingAccountId(accountId);
    setError("");

    try {
      const updatedAccount = await unfreezeAccount(token, accountId);

      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingAccountId(null);
    }
  }

  function formatAccountType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function formatBalance(balance) {
    return Number(balance).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function getStatusClasses(status) {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "frozen") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "closed") {
      return "bg-slate-100 text-slate-600";
    }

    return "bg-slate-100 text-slate-600";
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#062b4f]">
              Account Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage bank accounts and account status.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Accounts Table */}
          <section className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-[#062b4f]">
                Bank Accounts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Freeze or unfreeze customer accounts.
              </p>
            </div>

            {loading ? (
              <div className="px-5 py-8 text-sm text-slate-500">
                Loading accounts...
              </div>
            ) : accounts.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-500">
                No accounts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Account
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Balance
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {accounts.map((account) => {
                      const isUpdating =
                        updatingAccountId === account.id;

                      return (
                        <tr key={account.id}>
                          {/* Account */}
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              Account #{account.id}
                            </p>

                            <p className="text-sm text-slate-500">
                              User ID: {account.user_id}
                            </p>
                          </td>

                          {/* Account Type */}
                          <td className="px-5 py-4 text-sm text-slate-700">
                            {formatAccountType(account.account_type)}
                          </td>

                          {/* Balance */}
                          <td className="px-5 py-4 text-sm font-medium text-slate-800">
                            {formatBalance(account.balance)}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                account.status
                              )}`}
                            >
                              {formatAccountType(account.status)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              {account.status === "active" && (
                                <Button
                                  onClick={() =>
                                    handleFreeze(account.id)
                                  }
                                  disabled={isUpdating}
                                  className="bg-amber-600 hover:bg-amber-700"
                                >
                                  {isUpdating
                                    ? "Freezing..."
                                    : "Freeze"}
                                </Button>
                              )}

                              {account.status === "frozen" && (
                                <Button
                                  onClick={() =>
                                    handleUnfreeze(account.id)
                                  }
                                  disabled={isUpdating}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {isUpdating
                                    ? "Unfreezing..."
                                    : "Unfreeze"}
                                </Button>
                              )}

                              {account.status === "closed" && (
                                <span className="text-sm text-slate-400">
                                  Closed
                                </span>
                              )}
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

export default AccountManagement;