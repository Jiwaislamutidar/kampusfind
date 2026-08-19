const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (configuredApiUrl || "http://localhost:5000").replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}