import { useQuery } from '@tanstack/react-query';

import axios from '@/api/client';

export type CurrencyInfo = {
  /** Uppercase code every price returned by the API is expressed in, e.g. `FCFA` or `GNF`. */
  currency: string;
  /** Units of that currency for 1 USD. */
  rate: number;
};

/** What the web storefront falls back to when the API doesn't answer. */
export const DEFAULT_CURRENCY: CurrencyInfo = { currency: 'FCFA', rate: 1 };

export const CURRENCY_QUERY_KEY = ['GET_CURRENCY'] as const;

/** Public. Follows the `base_currency` setting managed in the admin. */
export const useGetCurrency = () =>
  useQuery({
    queryKey: CURRENCY_QUERY_KEY,
    queryFn: async (): Promise<CurrencyInfo> => {
      const { data } = await axios.get('/currency');
      if (typeof data?.currency !== 'string' || data.currency.trim() === '') {
        throw new Error('GET /currency returned no currency');
      }
      return {
        currency: data.currency.trim().toUpperCase(),
        rate: typeof data.rate === 'number' ? data.rate : DEFAULT_CURRENCY.rate,
      };
    },
    staleTime: 60_000,
  });
