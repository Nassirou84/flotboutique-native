import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';

import axios, { endpoints } from '@/api/client';
import { deleteTrustedDevice } from '@/api/trusted-devices/delete-trusted-device';
import { editProfile } from '@/api/user/edit-profile';
import { getAuthenticatedUser } from '@/api/user/get-authenticated-user';
import { refreshTokenRequest, type SessionResponse } from '@/api/user/refresh-token';
import type { Address, User } from '@/types/user';

import { getFingerprint } from './device';
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from './refresh-token-store';
import { isValidToken, setSession } from './utils';

type State = { loading: boolean; user: User | null; is2FaRequired: boolean };

type Action =
  | { type: 'INITIAL'; user: User | null }
  | { type: 'LOGIN'; user: User }
  | { type: 'UPDATE_USER'; fields: Partial<User> }
  | { type: 'TFA_REQUIRED' }
  | { type: 'LOGOUT' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INITIAL':
      return { loading: false, user: action.user, is2FaRequired: false };
    case 'LOGIN':
      return { ...state, user: action.user, is2FaRequired: false };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.fields } } : state;
    case 'TFA_REQUIRED':
      return { ...state, user: null, is2FaRequired: true };
    case 'LOGOUT':
      return { ...state, user: null, is2FaRequired: false };
  }
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  is2FaRequired: boolean;
  /** Resolves normally when a 2FA code is required: check `is2FaRequired`, then call `confirm2FA`. */
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  confirm2FA: (code: string, email: string) => Promise<void>;
  resend2FACode: (email: string) => Promise<void>;
  /** `idToken` comes from a native Google sign-in. */
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Saves the signed-in user's name and updates `user` with what the server stored. */
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  /** Replaces the whole list of delivery addresses, as the web storefront does. */
  updateAddresses: (addresses: Address[]) => Promise<void>;
  updateTwoFactor: (enabled: boolean) => Promise<void>;
  /** Revokes a trusted device on the server, then drops it from `user.trustedDevices`. */
  removeTrustedDevice: (deviceId: string) => Promise<void>;
  /** Reloads `user` from the server. Rejects on failure without touching the session. */
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { loading: true, user: null, is2FaRequired: false });
  const initialized = useRef(false);

  // The refresh schedules itself again after each success, so it is reached through a ref.
  const refreshRef = useRef<() => Promise<void>>(async () => {});
  const scheduleRefresh = useCallback(() => {
    refreshRef.current();
  }, []);

  // Silently refreshes the access token shortly before it expires, then schedules the next refresh.
  const refreshSession = useCallback(async () => {
    try {
      const { access_token, user } = await refreshTokenRequest();
      if (!access_token || !isValidToken(access_token) || !user) throw new Error('Invalid refresh response');
      setSession(access_token, scheduleRefresh);
      dispatch({ type: 'LOGIN', user });
    } catch {
      // The refresh token is no longer valid: drop the session.
      setSession(null);
      await clearRefreshToken();
      dispatch({ type: 'LOGOUT' });
    }
  }, [scheduleRefresh]);

  useEffect(() => {
    refreshRef.current = refreshSession;
  }, [refreshSession]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const { access_token, user } = await refreshTokenRequest();
        if (access_token && isValidToken(access_token) && user) {
          setSession(access_token, scheduleRefresh);
          dispatch({ type: 'INITIAL', user });
          return;
        }
      } catch {
        // No session yet: continue as a guest.
      }
      dispatch({ type: 'INITIAL', user: null });
    })();
  }, [scheduleRefresh]);

  const startSession = useCallback(
    async (
      { access_token, refresh_token, user }: Partial<SessionResponse> & { message?: string },
      fallbackMessage: string,
    ) => {
      if (!access_token || !user) throw new Error(fallbackMessage);
      // Persist first: a session that cannot survive a restart should fail loudly at sign-in.
      if (!refresh_token) throw new Error(fallbackMessage);
      await saveRefreshToken(refresh_token);
      setSession(access_token, scheduleRefresh);
      dispatch({ type: 'LOGIN', user });
    },
    [scheduleRefresh],
  );

  const login = useCallback<AuthContextType['login']>(
    async (email, password) => {
      try {
        const fingerprint = await getFingerprint();
        const { data } = await axios.post(endpoints.auth.login, { email, password, fingerprint });
        await startSession(data, data.message || 'Login failed');
      } catch (error) {
        if ((error as { TFARequired?: boolean })?.TFARequired) {
          dispatch({ type: 'TFA_REQUIRED' });
          return;
        }
        throw error;
      }
    },
    [startSession],
  );

  const loginWithGoogle = useCallback<AuthContextType['loginWithGoogle']>(
    async (idToken) => {
      const { data } = await axios.post(endpoints.auth.googleLogin, { id_token: idToken });
      await startSession(data, data.message || 'Login with Google failed');
    },
    [startSession],
  );

  const confirm2FA = useCallback<AuthContextType['confirm2FA']>(
    async (code, email) => {
      const fingerprint = await getFingerprint();
      const { data } = await axios.post(endpoints.auth.confirm2FA, { code, email, fingerprint });
      await startSession(data, data.message || 'Two-factor authentication failed');
    },
    [startSession],
  );

  const resend2FACode = useCallback<AuthContextType['resend2FACode']>(async (email) => {
    const fingerprint = await getFingerprint();
    const { data } = await axios.post(endpoints.auth.resend2FACode, { email, fingerprint });
    if (!data.success) throw new Error(data.message || 'Resend 2FA code failed');
  }, []);

  const register = useCallback<AuthContextType['register']>(
    async (email, password, firstName, lastName) => {
      const fingerprint = await getFingerprint();
      const { data } = await axios.post(endpoints.auth.register, { email, password, firstName, lastName, fingerprint });
      await startSession(data, data.message || 'Registration failed');
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      // The server can no longer read a cookie, so it needs the token to revoke it.
      await axios.post(endpoints.auth.logout, { refresh_token: await getRefreshToken() });
    } finally {
      // Always drop the local session, even if the server call failed.
      setSession(null);
      await clearRefreshToken();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const updateProfile = useCallback<AuthContextType['updateProfile']>(async (firstName, lastName) => {
    dispatch({ type: 'UPDATE_USER', fields: await editProfile({ firstName, lastName }) });
  }, []);

  const updatePhone = useCallback<AuthContextType['updatePhone']>(async (phone) => {
    dispatch({ type: 'UPDATE_USER', fields: await editProfile({ phone }) });
  }, []);

  const updateAddresses = useCallback<AuthContextType['updateAddresses']>(async (addresses) => {
    dispatch({ type: 'UPDATE_USER', fields: await editProfile({ addresses }) });
  }, []);

  const updateTwoFactor = useCallback<AuthContextType['updateTwoFactor']>(async (enabled) => {
    dispatch({ type: 'UPDATE_USER', fields: await editProfile({ twoFactor: enabled }) });
  }, []);

  const removeTrustedDevice = useCallback<AuthContextType['removeTrustedDevice']>(
    async (deviceId) => {
      await deleteTrustedDevice(deviceId);
      dispatch({
        type: 'UPDATE_USER',
        fields: { trustedDevices: state.user?.trustedDevices?.filter((d) => d.id !== deviceId) ?? [] },
      });
    },
    [state.user?.trustedDevices],
  );

  const refreshUser = useCallback<AuthContextType['refreshUser']>(async () => {
    dispatch({ type: 'UPDATE_USER', fields: await getAuthenticatedUser() });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: !state.loading && !!state.user,
      unauthenticated: !state.loading && !state.user,
      is2FaRequired: state.is2FaRequired,
      login,
      register,
      confirm2FA,
      resend2FACode,
      loginWithGoogle,
      logout,
      updateProfile,
      updatePhone,
      updateAddresses,
      updateTwoFactor,
      removeTrustedDevice,
      refreshUser,
    }),
    [state, login, register, confirm2FA, resend2FACode, loginWithGoogle, logout, updateProfile, updatePhone, updateAddresses, updateTwoFactor, removeTrustedDevice, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
