import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { DEFAULT_CURRENCY, useGetCurrency } from '@/api/currency/get-currency';
import { formatPrice } from '@/utils/format';

type CurrencyContextType = {
  currency: string;
  rate: number;
  /** "12 000 GNF" */
  format: (amount: number) => string;
  /** Same, with `F` instead of `FCFA` for tight layouts such as product cards. */
  formatCompact: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

/**
 * Mirrors the storefront's `CurrencyProvider`: the API prices are already in the currency set by the
 * admin (`base_currency`), so only the label follows it. Falls back to FCFA when the API is unreachable.
 */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, refetch } = useGetCurrency();
  const { currency, rate } = data ?? DEFAULT_CURRENCY;

  // An admin currency change also changes every price the API returns, so reload what is on screen.
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (previous.current && previous.current !== currency) queryClient.invalidateQueries();
    previous.current = currency;
  }, [currency, queryClient]);

  // The setting is not cached server-side, so pick up a change when the app comes back to the foreground.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refetch();
    });
    return () => subscription.remove();
  }, [refetch]);

  const value = useMemo<CurrencyContextType>(
    () => ({
      currency,
      rate,
      format: (amount) => `${formatPrice(amount)} ${currency}`,
      formatCompact: (amount) => `${formatPrice(amount)} ${currency === 'FCFA' ? 'F' : currency}`,
    }),
    [currency, rate],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
