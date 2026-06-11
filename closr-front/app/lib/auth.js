import { apiRequest } from "./api";
import { clearTokens, getRefreshToken, setTokens } from "./tokens";

export async function registerRequest({ username, email, password }) {
  return apiRequest("/users", {
    method: "POST",
    body: { username, email, password },
    auth: "none",
  });
}

export async function loginRequest({ email, password }) {
  const data = await apiRequest("/users/login", {
    method: "POST",
    body: { email, password },
    auth: "none",
  });
  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data;
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiRequest("/users/logout", {
        method: "POST",
        body: { refreshToken },
        auth: "none",
      });
    }
  } finally {
    clearTokens();
  }
}

export async function fetchMe() {
  return apiRequest("/users/me");
}
