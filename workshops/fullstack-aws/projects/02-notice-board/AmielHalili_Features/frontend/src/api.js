// Replace with your API Gateway Invoke URL after terraform apply
const API_URL = import.meta.env.VITE_API_URL || ''

export async function getNotices() {
  const res = await fetch(`${API_URL}/notices`)
  return res.json()
}
