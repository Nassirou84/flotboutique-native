// Set EXPO_PUBLIC_API_URL in .env.local (see .env.example). It is inlined at bundle time.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set: API requests will fail.');
}

/** Scheme + host of the API, used to resolve relative asset URLs such as product photos. */
export const API_ORIGIN = API_URL ? new URL(API_URL).origin : '';
