import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { Product } from '@/types/product';

export type GetAllProductsFilters = {
  title?: string;
  category?: string;
  subcategory?: string;
  /** Raw API Platform order clause, e.g. `[createdAt]=desc`. Only `createdAt` is sortable server-side today. */
  order?: string;
};

export type ProductsPage = { products: Product[]; totalItems: number };

export const getAllProducts = async (page: number, filters: GetAllProductsFilters): Promise<ProductsPage> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('isAvailable', '1');

  if (filters.title) params.append('title', filters.title);
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
