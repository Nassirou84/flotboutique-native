import { useMutation, useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { Order } from '@/types/order';
import type { ShippingAddress } from '@/types/user';

export const useUserOrders = ({
  userId,
  page,
  filters = {},
  enabled = true,
}: {
  userId: number;
  page: number;
  filters?: Record<string, string>;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ['GET_USER_ORDERS', userId, page, filters],
    queryFn: async (): Promise<Order[]> => {
      const response = await axios.get(`/customer/${userId}/orders`, { params: { page, ...filters } });
      return response.data['member'];
    },
    enabled: enabled && !!userId,
    retryDelay: 20_000,
  });

export type OrderSummary = { totalOrders: number; activeOrders: number; totalSpent: number };

export const useGetOrderSummary = (userId: number) =>
  useQuery({
    queryKey: ['GET_ORDER_SUMMARY', userId],
    queryFn: async (): Promise<OrderSummary> => (await axios.get('/order/summary')).data,
    enabled: !!userId,
    retryDelay: 20_000,
  });

export type PromoCodeResult = {
  success: boolean;
  amountAfterDiscount: number;
  discountedAmount: number;
  error?: string;
};

export const checkPromoCode = async (code: string): Promise<PromoCodeResult> =>
  (await axios.get(`/promo_codes/check/${code}`)).data;

export type PlaceOrderData = {
  shippingAddress: ShippingAddress;
  basketUid: string;
  paymentMethod: string;
  paymentDetails?: { cardNumber: string; expiry: string; cvc: string };
  promoCode?: string;
};

export type OrderPlaceResponse = {
  success: boolean;
  orderNumber: string | null;
  email: string | null;
  estimatedDelivery: string | null;
  totalAmount: number | null;
  fullAddress: string | null;
  items: { productName: string; quantity: number }[];
};

export const placeOrder = async (data: PlaceOrderData): Promise<OrderPlaceResponse> =>
  (await axios.post('/orders/finalize', data)).data;

export const usePlaceOrder = () => useMutation({ mutationFn: placeOrder });
