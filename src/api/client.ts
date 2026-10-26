import { create, type AxiosRequestConfig } from 'axios';

import { API_URL } from '@/config';

// The backend keeps the refresh token and the guest basket session in cookies, so every
// request must send/receive them. React Native's networking stack persists them natively.
const axiosInstance = create({ baseURL: API_URL, withCredentials: true, timeout: 20_000 });

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
    login: '/user_login',
    register: '/users',
    logout: '/auth/logout',
    googleLogin: '/auth/google',
    refreshToken: '/token/refresh',
    confirm2FA: '/2fa/verify',
    resend2FACode: '/resend-2fa-code',
  },
};
