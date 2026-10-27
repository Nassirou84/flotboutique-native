import { router } from 'expo-router';

import type { Condition } from '@/data/products';

export const goToCatalogue = (params?: { q?: string; condition?: Condition }) =>
  router.navigate({ pathname: '/catalogue', params });

/** Opens the filters page; applying them there leads on to the catalogue, keeping the typed search. */
export const goToFilters = (params?: { q?: string }) =>
  router.push({ pathname: '/filtres', params: { from: 'home', ...params } });
