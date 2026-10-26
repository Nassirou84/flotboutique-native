import * as Crypto from 'expo-crypto';
import { getCalendars, getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Same shape the backend receives from the web app's FingerprintJS call. */
export type FingerprintComponents = {
  userAgent: string;
  language: string;
  platform: string;
  timeZone: string;
  visitorId: string;
};

const VISITOR_ID_KEY = 'flot.visitor_id';

let cachedVisitorId: string | undefined;

/** A random ID generated once per install and kept in the keychain/keystore, so the backend's trusted-device (2FA) logic sees a stable device. */
async function getVisitorId(): Promise<string> {
  if (cachedVisitorId) return cachedVisitorId;

  try {
    const stored = await SecureStore.getItemAsync(VISITOR_ID_KEY);
    if (stored) return (cachedVisitorId = stored);
  } catch {
    // Fall through and generate a new one.
  }

  const id = Crypto.randomUUID();
  cachedVisitorId = id;
  try {
    await SecureStore.setItemAsync(VISITOR_ID_KEY, id);
  } catch {
    // Not persisted: the ID is stable for this session only.
  }
  return id;
}

export async function getFingerprint(): Promise<FingerprintComponents> {
  return {
    userAgent: `FlotBoutique/${Platform.OS} ${Platform.Version}`,
    language: getLocales()[0]?.languageTag ?? 'fr-FR',
    platform: Platform.OS,
    timeZone: getCalendars()[0]?.timeZone ?? 'UTC',
    visitorId: await getVisitorId(),
  };
}
