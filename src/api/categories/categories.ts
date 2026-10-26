import { useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { Category } from '@/types/category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get('/categories');
  return response.data['member'];
};

export const useGetCategories = () =>
  useQuery({ queryKey: ['GET_CATEGORY_ALL'], queryFn: getCategories, retryDelay: 20_000 });
