import axios, { endpoints } from '@/api/client';
import type { User } from '@/types/user';

export type SessionResponse = { access_token: string; user: User };

/** Exchanges the refresh-token cookie for a new access token. Rejects when there is no valid session. */
export const refreshTokenRequest = async (): Promise<SessionResponse> => {
  const response = await axios.post(endpoints.auth.refreshToken, {});
  return response.data;
};
