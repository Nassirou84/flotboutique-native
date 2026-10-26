import { router } from 'expo-router';

import type { Condition } from '@/data/products';

export const goToCatalogue = (params?: { q?: string; condition?: Condition }) =>
  router.navigate({ pathname: '/catalogue', params });
