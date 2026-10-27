import { create, type AxiosRequestConfig } from 'axios';

import { API_URL } from '@/config';

// The guest basket session still lives in a cookie, so requests must send/receive cookies (React
// Native's networking stack persists them natively). The refresh token does not: the backend's
// `/mobile/auth/*` routes return it in the response body and it is kept in the secure store.
const axiosInstance = create({ baseURL: API_URL, withCredentials: true, timeout: 20_000 });

const MOBILE_AUTH_PREFIX = '/mobile/auth';

// Those routes are public and the backend's JWT authenticator rejects an expired Bearer token before
// the controller runs, so the (possibly expired) access token must not be sent to them. `X-Client: mobile`
// makes the backend return the refresh token in the JSON body; without it, it only sets an HttpOnly cookie.
axiosInstance.interceptors.request.use((config) => {
  if (config.url?.startsWith(MOBILE_AUTH_PREFIX)) {
    config.headers.delete('Authorization');
    config.headers.set('X-Client', 'mobile');
  }
  return config;
});

// Reject with the server's response body (API Platform error / `{ message }`) so callers can read
// `error.detail`, `error.message` or `error.TFARequired` directly.
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || error.message || 'Something went wrong'),
);

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

export const endpoints = {
  auth: {
    login: '/mobile/auth/login',
    register: '/mobile/auth/register',
    logout: '/mobile/auth/logout',
    googleLogin: '/mobile/auth/google',
    refreshToken: '/mobile/auth/refresh',
    confirm2FA: '/mobile/auth/2fa/verify',
    resend2FACode: '/mobile/auth/2fa/resend',
  },
};
