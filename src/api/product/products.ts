import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { Product } from '@/types/product';

export type GetAllProductsFilters = {
  title?: string;
  category?: string;
  subcategory?: string;
  /** `new`, `refurbished` or `used` (exact match). */
  productCondition?: string;
  /** Inclusive bounds on the displayed price, in the storefront currency. */
  minPrice?: number;
  maxPrice?: number;
  sellerChoice?: boolean;
  primeDelivery?: boolean;
  /** Raw API Platform order clause: `[createdAt]=desc`, `[usdPrice]=asc` or `[usdPrice]=desc`. */
  order?: string;
};

export type ProductsPage = { products: Product[]; totalItems: number };

export const getAllProducts = async (page: number, filters: GetAllProductsFilters): Promise<ProductsPage> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('isAvailable', '1');

  if (filters.title) params.append('title', filters.title);
  if (filters.productCondition) params.append('productCondition', filters.productCondition);
  if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
  if (filters.sellerChoice) params.append('sellerChoice', 'true');
  if (filters.primeDelivery) params.append('primeDelivery', 'true');
  if (filters.category) params.append('category.title', filters.category);
  if (filters.subcategory) params.append('subcategory.title', filters.subcategory);

  const response = await axios.get(`/products?${params.toString()}${filters.order ? `&order${filters.order}` : ''}`);
  return { products: response.data['member'], totalItems: response.data['totalItems'] };
};

export const useGetProducts = (filters: GetAllProductsFilters = {}) =>
  useInfiniteQuery({
    queryKey: ['GET_ALL_PRODUCTS', filters],
    queryFn: ({ pageParam }) => getAllProducts(pageParam, filters),
    initialPageParam: 1,
    // Keep the list on screen while a new filter or sort loads, instead of flashing the loader.
    placeholderData: keepPreviousData,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, p) => n + p.products.length, 0);
      return last.products.length > 0 && loaded < last.totalItems ? pages.length + 1 : undefined;
    },
  });

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`/products/get-one-product?slug=${encodeURIComponent(slug)}`);
    return (response.data['member']?.[0] as Product | undefined) ?? null;
  } catch (error) {
    if ((error as { status?: number })?.status === 404) return null;
    throw error;
  }
};

export const useGetProduct = (slug?: string) =>
  useQuery({
    queryKey: ['GET_PRODUCT', slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });
