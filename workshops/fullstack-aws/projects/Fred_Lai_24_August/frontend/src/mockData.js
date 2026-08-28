// src/pages/mockData.js
//
// Stand-in for the real API responses while the backend isn't wired up.
// Shapes match what the FastAPI endpoints actually return, so swapping
// this out for real fetch calls later is a drop-in replacement.

export const mockAccounts = [
  { id: 1, account_type: "checking", balance: 2450.75, status: "active" },
  { id: 2, account_type: "savings", balance: 8120.5, status: "active" },
];

export const mockTransactions = {
  1: [
    { id: 101, transaction_type: "deposit", amount: 1250.0, timestamp: "2025-05-16", description: "Direct Deposit" },
    { id: 102, transaction_type: "withdrawal", amount: 59.99, timestamp: "2025-05-15", description: "Amazon Purchase" },
    { id: 103, transaction_type: "withdrawal", amount: 45.0, timestamp: "2025-05-13", description: "Gas Station" },
    { id: 104, transaction_type: "send", amount: 200.0, timestamp: "2025-05-14", description: "Transfer to Savings" },
  ],
  2: [
    { id: 201, transaction_type: "receive", amount: 200.0, timestamp: "2025-05-14", description: "Transfer from Checking" },
  ],
};
