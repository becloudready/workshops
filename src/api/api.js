// Shared API utilities for communicating with the FastAPI backend.
<<<<<<< HEAD
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

=======
// Put reusable fetch functions, the backend base URL, and JWT authorization headers here.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/**
 * FastAPI returns errors as {detail: ...}. For 4xx it's usually a string,
 * but 422 validation errors come back as an array of objects. Flatten both
 * into a single readable string.
 */
function extractDetail(body, fallback) {
  const detail = body?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null;
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join(", ");
  }

  return fallback;
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // Network-level failure: server down, wrong port, CORS preflight rejected.
    throw new Error("Could not reach the server. Is the API running?");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(extractDetail(payload, `Request failed (${response.status})`));
  }

  return payload;
}

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function register({ first_name, last_name, email, dob, password }) {
  return request("/auth/register", {
    method: "POST",
    body: { first_name, last_name, email, dob, password },
  });
}

export function getCurrentUser(token) {
  return request("/auth/me", { token });
}

export function forgotPassword(email) {
  return request("/auth/forgot-password", { method: "POST", body: { email } });
}

export function resetPassword(token, new_password) {
  return request("/auth/reset-password", { method: "POST", body: { token, new_password } });
}

export { BASE_URL };
>>>>>>> main
