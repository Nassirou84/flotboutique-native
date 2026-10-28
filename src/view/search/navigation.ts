import { router } from 'expo-router';

/** Opens the full-screen search, pre-filled with what has been typed so far. */
export const goToSearch = (q?: string) => router.push({ pathname: '/recherche', params: q ? { q } : undefined });

/** Shows the catalogue for a search. `t` makes the catalogue re-sync even when `q` is unchanged. */
export const showSearchResults = (q: string) =>
  router.navigate({ pathname: '/catalogue', params: { q, t: String(Date.now()) } });
