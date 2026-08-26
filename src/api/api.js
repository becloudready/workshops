// Shared API utilities for communicating with the FastAPI backend.
//
// Requests go to "/api/..." — Vite's dev server (see vite.config.js)
// forwards those to the real backend at http://127.0.0.1:8000. This
// avoids CORS errors during development.

const BASE_URL = "/api";


export function getCurrentUserId() {
  return localStorage.getItem("bankapp_user_id");
}

export function setCurrentUserId(id) {
  localStorage.setItem("bankapp_user_id", id);
}

if (typeof window !== "undefined") {
  // Dev convenience so you don't have to import this file from the console.
  window.setBankUserId = setCurrentUserId;
}

async function request(path, options = {}) {
  const userId = getCurrentUserId();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // Response wasn't JSON — keep the plain status text.
    }
    throw new Error(detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

// --- Current user ---
// GET /users/{id} allows a user to view themselves, so this doubles as
// a stand-in for a "/users/me" endpoint.
export function getCurrentUser() {
  const userId = getCurrentUserId();
  return request(`/users/${userId}`);
}

// --- Accounts ---
export function getAccount(accountId) {
  return request(`/accounts/${accountId}`);
}


export function getMyAccounts(accountIds) {
  return Promise.all(accountIds.map(getAccount));
}

// --- Transactions ---
export function getAccountTransactions(accountId) {
  return request(`/accounts/${accountId}/transactions`);
}

// --- Transfers ---
export function createTransfer({ fromAccountId, toAccountId, amount }) {
  return request(`/transfers`, {
    method: "POST",
    body: JSON.stringify({
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount,
    }),
  });
}

