import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';

import { useGetProducts } from '@/api/product/products';
import { toProductView } from '@/data/products';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';

import { setFiltersState, useFiltersState } from './filters-store';
import {
  SORT_CLAUSES,
  SORT_ORDER,
  countActiveFilters,
  isTag,
  priceFilters,
  tagFilters,
  type Tag,
} from './constants';

/** State and data for the catalogue screen: URL params, search, filters, sort and the paginated product list. */
export function useCatalogue() {
  const params = useLocalSearchParams<{ q?: string; condition?: string; t?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [tag, setTag] = useState<Tag>(isTag(params.condition) ? params.condition : 'all');

  // Tab screens stay mounted, so re-sync when the home screen links in with new params.
  const paramsKey = `${params.q ?? ''}|${params.condition ?? ''}|${params.t ?? ''}`;
  const [seenParams, setSeenParams] = useState(paramsKey);
  if (seenParams !== paramsKey) {
    setSeenParams(paramsKey);
    setQuery(params.q ?? '');
    setTag(isTag(params.condition) ? params.condition : 'all');
  }

  // Edited on the filters page, which is a separate route.
  const { filters, sort } = useFiltersState();

  // Search, tag, category, price and sort are all done by the API, so they apply to the whole catalogue
  // (and to the total shown), not just to the pages loaded so far.
  const debouncedQuery = useDebouncedValue(query.trim());
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetProducts({
    title: debouncedQuery || undefined,
    ...tagFilters(tag),
    category: filters.category || undefined,
    subcategory: filters.subcategory || undefined,
    ...priceFilters(filters),
    order: SORT_CLAUSES[sort],
  });

  const totalItems = data?.pages[0]?.totalItems ?? 0;

  const products = useMemo(() => (data?.pages ?? []).flatMap((page) => page.products.map(toProductView)), [data]);

  const { refreshing, refresh } = usePullToRefresh(refetch);

  return {
    query,
    setQuery,
    tag,
    setTag,
    sort,
    activeFilters: countActiveFilters(filters),
    cycleSort: () => setFiltersState({ sort: SORT_ORDER[(SORT_ORDER.indexOf(sort) + 1) % SORT_ORDER.length] }),
    products,
    resultCount: totalItems,
    isLoading,
    isError,
    error,
    refetch,
    refreshing,
    refresh,
    loadMore: () => hasNextPage && !isFetchingNextPage && fetchNextPage(),
    isFetchingNextPage,
  };
}
