import { router } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/auth/auth-provider';

/** Closes the auth page as soon as there is a session: after sign-in, sign-up, or when already signed in. */
export function useLeaveWhenAuthenticated() {
  const { authenticated } = useAuth();

  useEffect(() => {
    if (!authenticated) return;
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [authenticated]);
}
