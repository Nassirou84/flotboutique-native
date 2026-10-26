import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { useGetProducts } from '@/api/product/products';
import { toProductView } from '@/data/products';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { SORT_ORDER, isCategory, type Category, type Sort } from './constants';

/** State and data for the catalogue screen: URL params, search, filters, sort and the paginated product list. */
export function useCatalogue() {
  const params = useLocalSearchParams<{ q?: string; condition?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState<Category>(isCategory(params.condition) ? params.condition : 'all');

  // Tab screens stay mounted, so re-sync when the home screen links in with new params.
  const paramsKey = `${params.q ?? ''}|${params.condition ?? ''}`;
  const [seenParams, setSeenParams] = useState(paramsKey);
  if (seenParams !== paramsKey) {
    setSeenParams(paramsKey);
    setQuery(params.q ?? '');
    setCategory(isCategory(params.condition) ? params.condition : 'all');
  }

  const [sort, setSort] = useState<Sort>('popularity');

  // Search is done server-side (`title`). The API can't yet filter by condition or sort by price,
  // so those apply to the pages loaded so far.
  const debouncedQuery = useDebouncedValue(query.trim());
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetProducts({ title: debouncedQuery || undefined });

  const totalItems = data?.pages[0]?.totalItems ?? 0;

  const products = useMemo(() => {
    const list = (data?.pages ?? []).flatMap((page) => page.products.map(toProductView));
    const filtered = category === 'all' ? list : list.filter((p) => p.condition === category);
    if (sort === 'price-asc') return [...filtered].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price-desc') return [...filtered].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    return filtered;
  }, [data, category, sort]);

  // A condition filter can leave too few items on screen to trigger onEndReached: keep loading.
  useEffect(() => {
    if (category !== 'all' && products.length < 6 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [category, products.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    sort,
    cycleSort: () => setSort((s) => SORT_ORDER[(SORT_ORDER.indexOf(s) + 1) % SORT_ORDER.length]),
    products,
    resultCount: category === 'all' ? totalItems : products.length,
    isLoading,
    isError,
    error,
    refetch,
    loadMore: () => hasNextPage && !isFetchingNextPage && fetchNextPage(),
    isFetchingNextPage,
  };
}
