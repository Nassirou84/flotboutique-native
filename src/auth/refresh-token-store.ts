import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'flot.refresh_token';

// AFTER_FIRST_UNLOCK so a silent refresh still works when the app wakes while the device is locked.
const OPTIONS: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK };

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY, OPTIONS);
  } catch {
    return null;
  }
}

export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, OPTIONS);
}

export async function clearRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, OPTIONS);
  } catch {
    // Nothing more to do: the session is dropped in memory regardless.
  }
}
