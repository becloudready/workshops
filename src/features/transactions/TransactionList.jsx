// src/features/transactions/TransactionList.jsx

function formatAmount(amount, type) {
  const signed = type === "deposit" || type === "receive" ? Math.abs(amount) : -Math.abs(amount);
  const sign = signed >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(signed).toFixed(2)}`;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p className="text-sm text-slate-400">No transactions yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {transactions.map((t) => {
        const isPositive = t.transaction_type === "deposit" || t.transaction_type === "receive";
        return (
          <li key={t.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t.description || t.transaction_type.charAt(0).toUpperCase() + t.transaction_type.slice(1)}
              </p>
              <p className="text-xs text-slate-400">{formatDate(t.timestamp)}</p>
            </div>
            <span className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-slate-900"}`}>
              {formatAmount(t.amount, t.transaction_type)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
