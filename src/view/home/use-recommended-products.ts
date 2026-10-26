import { useMemo } from 'react';

import { useGetProducts } from '@/api/product/products';
import { toProductView } from '@/data/products';

import { RECOMMENDED_COUNT } from './constants';

/** The first products of the catalogue, shown on the home screen. */
export function useRecommendedProducts() {
  const { data, isLoading, isError, error, refetch } = useGetProducts();
  const products = useMemo(
    () => (data?.pages[0]?.products ?? []).slice(0, RECOMMENDED_COUNT).map(toProductView),
    [data],
  );

  return { products, isLoading, isError, error, refetch };
}
