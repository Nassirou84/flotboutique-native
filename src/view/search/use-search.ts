import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { useSearchSuggestions } from '@/api/product/products';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { showSearchResults } from './navigation';

/** State for the search screen: the typed text and the predictions (keywords + products) for it. */
export function useSearch() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');

  const term = query.trim();
  const debounced = useDebouncedValue(term, 250);
  const { data, isFetching, isError, refetch } = useSearchSuggestions(debounced);

  const suggestions = data ?? [];
  // The debounce lags behind typing: until it catches up the list on screen is for an older term.
  const pending = term.length >= 2 && (term !== debounced || isFetching);

  return {
    query,
    setQuery,
    term,
    suggestions,
    pending,
    isError,
    refetch,
    submit: () => term && showSearchResults(term),
  };
}
