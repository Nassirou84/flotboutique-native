import { useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { PaymentMethod } from '@/types/payment-method';
import { getErrorMessage } from '@/utils/errors';

export const paymentMethodsQueryKey = (userId: number) => ['GET_PAYMENT_METHODS', userId] as const;

/** First page only (10 items), like the web storefront. */
export const useGetPaymentMethods = (userId: number) =>
  useQuery({
    queryKey: paymentMethodsQueryKey(userId),
    enabled: !!userId,
    staleTime: 0,
    queryFn: async (): Promise<PaymentMethod[]> => (await axios.get(`/users/${userId}/payment_methods`)).data['member'],
  });

/** The API only requires a non-empty provider; these are the ones the app offers. */
export type MobileProvider = 'wave' | 'orange';

export type NewPaymentMethod =
  | { method: 'card'; cardNumber: string; cardHolderName: string; expiry: string; cvv: string; isDefault: boolean }
  | { method: 'mobile_payment'; mobilePaymentNumber: string; mobileProvider: MobileProvider; isDefault: boolean };

/** The API validates cards (Luhn, expiry, CVV) and answers 400 with those errors as a JSON string. */
export const savePaymentMethod = async (data: NewPaymentMethod): Promise<void> => {
  await axios.post('/payment_methods', { ...data, isActive: true });
};

/** `EditPaymentMethodController` reads `isDefault`, `cardHolderName` and `expiryDate` (not `expiry`). */
export const editPaymentMethod = async (
  id: number,
  data: { isDefault?: boolean; cardHolderName?: string; expiryDate?: string },
): Promise<void> => {
  await axios.post(`/payment_methods/${id}/edit`, data);
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  await axios.delete(`/payment_methods/${id}`);
};

/** Turns `{"cvv":"CVV invalide"}`, which the card validation puts in `detail`, into a readable sentence. */
export function paymentErrorMessage(error: unknown, fallback: string): string {
  const message = getErrorMessage(error, fallback);
  try {
    const parsed: unknown = JSON.parse(message);
    if (parsed && typeof parsed === 'object') {
      const values = Object.values(parsed).filter((v): v is string => typeof v === 'string');
      if (values.length > 0) return values.join(' • ');
    }
  } catch {
    // Not JSON: a plain message.
  }
  return message;
}
