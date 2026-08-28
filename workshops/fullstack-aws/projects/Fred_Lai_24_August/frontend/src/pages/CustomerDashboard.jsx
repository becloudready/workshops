// src/pages/CustomerDashboard.jsx
//
// Main dashboard for authenticated customers. Displays the customer's
// accounts, balances, transaction history, and the transfer form.
//
// The logged-in user comes from AuthContext (already fetched once at
// login/session-restore) — this file only fetches what's specific to
// the dashboard: accounts, transactions, transfers.

import { useEffect, useState } from "react";
import AccountsOverview from "../features/accounts/AccountsOverview";
import TransactionList from "../features/transactions/TransactionList";
import TransferForm from "../features/transfers/TransferForm";
import { getMyAccounts, getAccountTransactions, createTransfer } from "../api/api";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/DashboardSidebar";


export default function CustomerDashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load this customer's accounts once, on mount.
  useEffect(() => {
    async function load() {
      setError("");
      try {
        const myAccounts = await getMyAccounts();
        setAccounts(myAccounts);
        setSelectedAccountId(myAccounts[0]?.id ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Whenever the selected account changes, load its transactions.
  useEffect(() => {
    if (!selectedAccountId) return;
    getAccountTransactions(selectedAccountId)
        .then((transactions) => {
            setTransactions([...transactions].reverse());
        })
        .catch((err) => setError(err.message));
  }, [selectedAccountId]);

  async function handleTransfer({ fromAccountId, toAccountId, amount }) {
    await createTransfer({ fromAccountId, toAccountId, amount });

    // Refresh balances and the transaction list so the UI reflects the transfer.
    const refreshedAccounts = await getMyAccounts();
    setAccounts(refreshedAccounts);
    const refreshedTransactions = await getAccountTransactions(selectedAccountId);
    setTransactions(refreshedTransactions);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f8]">
        <p className="text-sm text-slate-500">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f5f8]">
      <DashboardSidebar />


      <main className="min-w-0 flex-1 p-8 max-sm:p-4">
        <header className="mb-6">
          <h1 className="mb-1 text-xl font-bold text-[#16233f]">Hello, {user?.first_name || "there"}</h1>
          <p className="text-sm text-slate-500">Here's an overview of your accounts.</p>
        </header>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-5">
            <section id="overview" className="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="text-sm font-semibold text-[#16233f] mb-4">Accounts overview</h2>
            <AccountsOverview
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={setSelectedAccountId}
            />
            </section>

            <section id="transactions" className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#16233f]">Recent transactions</h2>
                <button className="text-xs font-semibold text-amber-600">View all</button>
              </div>
              <TransactionList transactions={transactions} />
            </section>
          </div>

          <div id="transfer">
            <TransferForm accounts={accounts} onSubmit={handleTransfer} />
          </div>
        </div>
      </main>
    </div>
  );
}
