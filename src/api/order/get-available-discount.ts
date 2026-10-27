import { useQuery } from '@tanstack/react-query';

import axios from '@/api/client';

/** The promo code open to every user (percentage), as `PromoCode` serializes it. */
export type AvailableDiscount = {
  id: number;
  code: string;
  /** Percentage, e.g. `"15"`. */
  discount: string;
  expiresAt?: string | null;
  createdAt?: string | null;
};

/** Public. Resolves to `null` when no such offer is running. */
export const useGetAvailableDiscount = () =>
  useQuery({
    queryKey: ['GET_AVAILABLE_DISCOUNT'],
    queryFn: async (): Promise<AvailableDiscount | null> =>
      (await axios.get<{ availableDiscount: AvailableDiscount | null }>('/available-discount')).data.availableDiscount,
  });
