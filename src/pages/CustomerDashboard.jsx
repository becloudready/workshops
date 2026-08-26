// Main dashboard for authenticated customers.
// Displays the customer's accounts, balances, transactions, and available customer actions.
// src/pages/CustomerDashboard.jsx
//
// Main dashboard for authenticated customers. Displays the customer's
// accounts, balances, transaction history, and the transfer form.
//
// Currently wired to local mock data (mockData.js) so it renders with no
// backend running. To connect it to the real API later:
//   1. import { getMyAccounts, getAccountTransactions, createTransfer } from "../api/api"
//   2. replace the two useState(mock...) lines below with useEffect calls
//      that fetch and setAccounts/setTransactions
//   3. pass createTransfer (mapped to the onSubmit shape) into <TransferForm onSubmit={...} />
// None of the child components need to change.

import { useState } from "react";
import AccountsOverview from "../features/accounts/AccountsOverview";
import TransactionList from "../features/transactions/TransactionList";
import TransferForm from "../features/transfers/TransferForm";
import { mockAccounts, mockTransactions } from "./mockData";

export default function CustomerDashboard({ customerName = "Example" }) {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState(mockAccounts[0]?.id ?? null);

  const transactions = mockTransactions[selectedAccountId] ?? [];

  function handleTransfer({ fromAccountId, toAccountId, amount }) {
    // Mock behavior: move the balance locally so the UI feels real.
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromAccountId) return { ...a, balance: a.balance - amount };
        if (a.id === toAccountId) return { ...a, balance: a.balance + amount };
        return a;
      })
    );
    return Promise.resolve();
  }

  return (
    <div className="p-8 bg-[#f4f5f8] min-h-screen">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-[#16233f] mb-1">Good afternoon, {customerName}</h1>
        <p className="text-sm text-slate-500">Here's an overview of your accounts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <section className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="text-sm font-semibold text-[#16233f] mb-4">Accounts overview</h2>
            <AccountsOverview
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={setSelectedAccountId}
            />
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#16233f]">Recent transactions</h2>
              <button className="text-xs font-semibold text-amber-600">View all</button>
            </div>
            <TransactionList transactions={transactions} />
          </section>
        </div>

        <TransferForm accounts={accounts} onSubmit={handleTransfer} />
      </div>
    </div>
  );
}
