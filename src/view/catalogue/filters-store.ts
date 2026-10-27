import { useSyncExternalStore } from 'react';

import { EMPTY_FILTERS, type CatalogueFilters, type Sort } from './constants';

/**
 * The filters and sort applied to the catalogue. They live outside the screens because the filters
 * page is its own route: it edits them and the catalogue (a mounted tab) reads them.
 */
export type FiltersState = { filters: CatalogueFilters; sort: Sort };

let state: FiltersState = { filters: EMPTY_FILTERS, sort: 'newest' };
const listeners = new Set<() => void>();

export const getFiltersState = () => state;

export const setFiltersState = (next: Partial<FiltersState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useFiltersState = () => useSyncExternalStore(subscribe, getFiltersState, getFiltersState);
