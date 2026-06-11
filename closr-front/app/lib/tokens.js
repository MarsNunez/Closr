import { TOKEN_KEYS } from "./config";

const isBrowser = () => typeof window !== "undefined";

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEYS.access);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEYS.refresh);
}

export function setTokens({ accessToken, refreshToken }) {
  if (!isBrowser()) return;
  if (accessToken) window.localStorage.setItem(TOKEN_KEYS.access, accessToken);
  if (refreshToken)
    window.localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
}

export function clearTokens() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEYS.access);
  window.localStorage.removeItem(TOKEN_KEYS.refresh);
}
