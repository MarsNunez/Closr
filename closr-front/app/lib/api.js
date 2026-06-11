import { API_URL } from "./config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokens";

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    if (!data?.accessToken) {
      clearTokens();
      return null;
    }

    setTokens({ accessToken: data.accessToken });
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function executeRequest(path, { method = "GET", body, headers = {}, token, signal, isFormData } = {}) {
  const finalHeaders = { ...headers };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let finalBody = body;
  if (body && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = typeof body === "string" ? body : JSON.stringify(body);
  }

  return fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
    signal,
    cache: "no-store",
  });
}

/**
 * Generic API request used from client components.
 * Automatically attaches access token (if present) and retries once after refresh on 401.
 */
export async function apiRequest(path, options = {}) {
  const { auth = "auto" } = options;
  let token = auth === "none" ? null : getAccessToken();

  let res = await executeRequest(path, { ...options, token });

  if (res.status === 401 && auth !== "none") {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await executeRequest(path, { ...options, token: newToken });
    }
  }

  const data = await parseBody(res);

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, { status: res.status, data });
  }

  return data;
}

/**
 * Server-side fetch (no auth, used in Server Components for public data).
 * Returns null on any failure so pages render gracefully.
 */
export async function apiServerFetch(path, { revalidate = 0 } = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
