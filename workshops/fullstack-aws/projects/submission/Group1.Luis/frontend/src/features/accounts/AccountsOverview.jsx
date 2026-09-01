// src/features/accounts/AccountsOverview.jsx

function formatBalance(balance) {
  return Number(balance).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function maskAccountId(id) {
  return `•••• ${String(id).padStart(4, "0").slice(-4)}`;
}

function AccountCard({ account, selected, onSelect }) {
  const isSavings = account.account_type === "savings";

  return (
    <button
      onClick={() => onSelect(account.id)}
      className={`text-left rounded-xl p-4 border-2 transition-colors ${
        isSavings ? "bg-amber-50" : "bg-slate-50"
      } ${selected ? "border-amber-500" : "border-transparent"}`}
    >
      <p className={`text-sm font-semibold mb-1 ${isSavings ? "text-amber-700" : "text-slate-700"}`}>
        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
      </p>
      <p className="text-xs text-slate-400 tracking-wider mb-3">{maskAccountId(account.id)}</p>
      <p className="text-2xl font-bold text-slate-900 mb-1">{formatBalance(account.balance)}</p>
      <p className="text-xs text-slate-400">
        {account.status === "active" ? "Available balance" : `Account ${account.status}`}
      </p>
    </button>
  );
}

export default function AccountsOverview({ accounts, selectedAccountId, onSelectAccount }) {
  if (accounts.length === 0) {
    return <p className="text-sm text-slate-400">No accounts found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          selected={account.id === selectedAccountId}
          onSelect={onSelectAccount}
        />
      ))}
    </div>
  );
}
