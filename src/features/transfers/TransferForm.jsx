// src/features/transfers/TransferForm.jsx
import { useState } from "react";

// onSubmit receives { fromAccountId, toAccountId, amount } and should
// return a promise. Swap in the real createTransfer() from api/api.js
// when the backend is wired up — this component doesn't need to change.
export default function TransferForm({ accounts, onSubmit }) {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fromId || !toId) {
      setError("Select both accounts.");
      return;
    }
    if (fromId === toId) {
      setError("Choose two different accounts.");
      return;
    }
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({ fromAccountId: Number(fromId), toAccountId: Number(toId), amount: numericAmount });
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 h-fit"
    >
      <h2 className="text-sm font-semibold text-[#16233f]">Make a transfer</h2>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
        From
        <select
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal"
        >
          <option value="" disabled>
            Select account
          </option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.account_type} •••• {String(a.id).padStart(4, "0").slice(-4)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
        To
        <select
          value={toId}
          onChange={(e) => setToId(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal"
        >
          <option value="" disabled>
            Select account
          </option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.account_type} •••• {String(a.id).padStart(4, "0").slice(-4)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
        Amount
        <div className="flex items-center border border-slate-200 rounded-lg px-3">
          <span className="text-slate-400 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border-none py-2.5 px-1.5 text-sm font-normal outline-none"
          />
        </div>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-3"
      >
        {submitting ? "Transferring..." : "Transfer"}
      </button>
    </form>
  );
}
