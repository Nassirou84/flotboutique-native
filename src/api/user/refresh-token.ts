import axios, { endpoints } from '@/api/client';
import { getRefreshToken, saveRefreshToken } from '@/auth/refresh-token-store';
import type { User } from '@/types/user';

export type SessionResponse = { access_token: string; refresh_token?: string; user: User };

// Refresh tokens are rotated: two concurrent calls would burn the same token and the second would fail,
// so concurrent callers share one request.
let inFlight: Promise<SessionResponse> | null = null;

/** Exchanges the stored refresh token for a new access token. Rejects when there is no valid session. */
export const refreshTokenRequest = (): Promise<SessionResponse> => {
  inFlight ??= (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const { data } = await axios.post<SessionResponse>(endpoints.auth.refreshToken, { refresh_token: refreshToken });
    if (data.refresh_token) await saveRefreshToken(data.refresh_token);
    return data;
  })().finally(() => {
    inFlight = null;
  });
  return inFlight;
};
