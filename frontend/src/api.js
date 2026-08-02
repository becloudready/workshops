const BASE = "/api";

export async function getNotices() {
  const res = await fetch(`${BASE}/notices`);
  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
}

export async function createNotice(notice) {
  const res = await fetch(`${BASE}/admin/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notice),
  });
  if (!res.ok) throw new Error("Failed to create notice");
  return res.json();
}

export async function deleteNotice(id) {
  const res = await fetch(`${BASE}/admin/notices/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete notice");
}
