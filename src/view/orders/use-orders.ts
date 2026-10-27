import { useEffect, useMemo, useState } from 'react';

import { useGetOrderSummary, useInfiniteUserOrders } from '@/api/order/orders';
import { useAuth } from '@/auth/auth-provider';

import { TAB_FILTERS, type OrdersTabKey } from './constants';

const SEARCH_DEBOUNCE_MS = 400;

export function useOrders() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;

  const [tab, setTab] = useState<OrdersTabKey>('all');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  // The API filters on the order number (`uid`), so wait for a pause in typing before querying.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const filters = useMemo(() => ({ ...TAB_FILTERS[tab], ...(search ? { uid: search } : {}) }), [tab, search]);

  const orders = useInfiniteUserOrders({ userId, filters });
  const { data: summary, refetch: refetchSummary } = useGetOrderSummary(userId);

  return {
    user,
    tab,
    setTab,
    query,
    setQuery,
    orders: orders.data?.pages.flat() ?? [],
    isLoading: orders.isLoading,
    isError: orders.isError,
    hasNextPage: orders.hasNextPage,
    isFetchingNextPage: orders.isFetchingNextPage,
    fetchNextPage: orders.fetchNextPage,
    refetch: () => Promise.all([orders.refetch(), refetchSummary()]),
    retry: orders.refetch,
    counts: summary ? { all: summary.totalOrders, active: summary.activeOrders } : undefined,
  };
}
