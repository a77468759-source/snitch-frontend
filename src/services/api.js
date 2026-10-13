const API_URL = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "" : "https://snitch-backend-1-4ert.onrender.com")
).replace(/\/+$/, "")

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers)
  const accessToken = token ?? localStorage.getItem("snitch.accessToken")

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })
  const payload = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    const validationMessage = payload?.errors?.map((error) => error.msg).filter(Boolean).join(", ")
    throw new Error(validationMessage || payload?.message || `Request failed (${response.status})`)
  }

  return payload
}
