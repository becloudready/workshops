// Shared API utilities for communicating with the FastAPI backend.
//
// Real login now exists on the backend (see login()/register() below),
// using a Bearer token instead of the old X-User-Id stand-in this file
// used before.
import {TOKEN_KEY} from "../context/AuthContext.jsx"

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// --- Auth token storage ---
// After login()/register() succeed, the login screen should call
// setToken(result.token) (check the exact field name the backend
// returns). Every other function below reads the token automatically
// via getToken(), so screens don't have to pass it around by hand.
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

if (typeof window !== "undefined") {
  // Dev convenience: if the login screen isn't fully wired up yet, you
  // can still test by getting a token another way (e.g. the Swagger
  // docs page) and running setBankToken("...") in the browser console.
  window.setBankToken = setToken;
}

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
  const authToken = token ?? getToken();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

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

// --- Auth ---
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

// ADMIN / USER API

// Get users
export function getUsers(
  token,
  { role, limit = 50, offset = 0 } = {}
) {
  const params = new URLSearchParams();

  if (role) params.set("role", role);

  params.set("limit", limit);
  params.set("offset", offset);

  return request(`/users?${params.toString()}`, {
    token,
  });
}

// Get today's total transaction count for the admin dashboard
export function getTodaysTransactions(token) {
  return request("/accounts/transactions/today", {
    token,
  });
}

// Get a single user
export function getUser(token, userId) {
  return request(`/users/${userId}`, {
    token,
  });
}

// Create a user
export function createUser(token, userData) {
  return request("/users", {
    method: "POST",
    body: userData,
    token,
  });
}

// Update a user
export function updateUser(token, userId, userData) {
  return request(`/users/${userId}`, {
    method: "PATCH",
    body: userData,
    token,
  });
}

// Update a user's role
export function updateUserRole(token, userId, role) {
  return request(`/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
    token,
  });
}

// Delete a user
export function deleteUser(token, userId) {
  return request(`/users/${userId}`, {
    method: "DELETE",
    token,
  });
}

export function resetUserPassword(token, userId, newPassword) {
  return request(`/users/${userId}/password`, {
    method: "PATCH",
    body: { new_password: newPassword },
    token,
  });
}


// ADMIN / ACCOUNT API

// Get all accounts
export function getAccounts(token) {
  return request("/accounts", {
    token,
  });
}

// Get a single account
export function getAccount(token, accountId) {
  return request(`/accounts/${accountId}`, {
    token,
  });
}

// Create an account
export function createAccount(token, accountData) {
  return request("/accounts", {
    method: "POST",
    body: accountData,
    token,
  });
}

// Freeze an account
export function freezeAccount(token, accountId) {
  return request(`/accounts/${accountId}/freeze`, {
    method: "PATCH",
    token,
  });
}

// Unfreeze an account
export function unfreezeAccount(token, accountId) {
  return request(`/accounts/${accountId}/unfreeze`, {
    method: "PATCH",
    token,
  });
}


export { BASE_URL };
// --- Accounts ---
export function getAccount(accountId) {
  return request(`/accounts/${accountId}`);
}

// NOTE: still no "list my accounts" endpoint on the backend — see
// MY_ACCOUNT_IDS in CustomerDashboard.jsx until that's added.
//
// Some of these ids won't belong to the logged-in user (that's expected
// with a hardcoded list) — that should mean "don't show that one," not
// "break the whole page." Promise.allSettled lets each account succeed
// or fail on its own instead of one 403 taking down the rest.
export function getMyAccounts() {
  return request("/accounts/me");
}

// --- Transactions ---
export function getAccountTransactions(accountId) {
  return request(`/accounts/${accountId}/transactions`);
}

// --- Transfers ---
export function createTransfer({ fromAccountId, toAccountId, amount }) {
  return request(`/transfers`, {
    method: "POST",
    body: {
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount,
    },
  });
}

export { BASE_URL, request };
