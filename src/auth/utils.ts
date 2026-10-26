import axios from '@/api/client';

function decodeJwt(token: string): { exp: number } {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
  return JSON.parse(json);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) return false;
  try {
    return decodeJwt(accessToken).exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

// Refresh a little before the token actually expires, so in-flight requests don't race the expiry.
const REFRESH_BEFORE_EXPIRY_MS = 60_000;

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Sets (or clears) the Bearer token on the API client. `onExpire` fires shortly before the token
 * expires so the caller can silently refresh it.
 */
export const setSession = (accessToken: string | null, onExpire?: () => void) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = undefined;
  }

  if (!accessToken) {
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  if (onExpire) {
    const { exp } = decodeJwt(accessToken);
    const timeLeft = exp * 1000 - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
    refreshTimer = setTimeout(onExpire, Math.max(timeLeft, 0));
  }
};
