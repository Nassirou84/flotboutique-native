import { useCallback, useState } from 'react';

/**
 * State for a `RefreshControl`. Tracked by hand because a query's `isRefetching` is also true during
 * background fetches (e.g. loading the next page), which would show the pull spinner by mistake.
 */
export function usePullToRefresh(refetch: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { refreshing, refresh };
}
