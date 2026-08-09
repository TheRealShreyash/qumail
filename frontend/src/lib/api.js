const rawUrl = import.meta.env.VITE_BACKEND_URL;
export const API_BASE_URL = rawUrl && rawUrl.trim() !== ""
  ? rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "")
  : "";

export async function apiRequest(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Ensure session cookies are sent with requests
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.message) errorMessage = errData.message;
    } catch {
      // Ignore JSON parse errors for non-JSON error pages
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
