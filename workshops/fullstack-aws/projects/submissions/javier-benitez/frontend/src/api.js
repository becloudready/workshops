const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const apiConfigured = Boolean(API_URL);

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Can't reach the API. Check that VITE_API_URL points to your API Gateway URL.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}.`);
  }
  return data;
}

export const getNotices = () => request("/notices");

export const createNotice = (name, message) =>
  request("/notices", { method: "POST", body: JSON.stringify({ name, message }) });

export const deleteNotice = (id) =>
  request(`/notices/${encodeURIComponent(id)}`, { method: "DELETE" });
