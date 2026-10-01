const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Response was not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}