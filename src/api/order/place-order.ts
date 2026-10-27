import { useMutation } from '@tanstack/react-query';

import axios from '@/api/client';
import type { ShippingAddress } from '@/types/user';

/** Methods accepted by the API's `OrderService`. */
export type PaymentMethodId = 'cod' | 'wave-money' | 'credit_card';

export type PlaceOrderData = {
  shippingAddress: ShippingAddress;
  basketUid: string;
  paymentMethod: PaymentMethodId;
  promoCode?: string;
};

export type OrderConfirmation = {
  success: boolean;
  message?: string;
  orderNumber: string | null;
  email: string | null;
  estimatedDeliveryAt: string | null;
  totalAmount: number | null;
  fullAddress: string | null;
  items: { productName: string; quantity: number }[];
};

export const useFinalizeOrder = () =>
  useMutation({
    mutationFn: async (data: PlaceOrderData) => {
      // `paymentDetails` is only read for cards, but the API's signature requires an array.
      const response = await axios.post<OrderConfirmation>('/orders/finalize', { ...data, paymentDetails: {} });
      if (!response.data.success) throw new Error(response.data.message || 'Impossible de finaliser la commande.');
      return response.data;
    },
  });
