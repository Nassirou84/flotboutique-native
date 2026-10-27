import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

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

export const useGetOrder = (id?: string) =>
  useQuery({
    queryKey: ['GET_ORDER', id],
    queryFn: async (): Promise<Order> => (await axios.get(`/orders/${id}`)).data,
    enabled: !!id,
  });

/** Shape of `ReceiptController`. Money is in FCFA; `discount`, `shipping` and `tax` are null on older orders. */
export type OrderReceipt = {
  order: {
    reference: string;
    customer: { fullName: string; phone: string | null; email: string | null; address: string };
    subtotal: number;
    discount: number | null;
    shipping_tier: 'Express' | 'Standard';
    shipping: number | null;
    taxRate: number;
    tax: number | null;
    total: number;
    items: { productName: string; qty: number; unit_price: number; sku: string; variant: string | null }[];
    payment: { transactionId: string | null; method: string; amount: number; status: string; last4: string | null };
  };
};

/** Full price breakdown and payment of an order. `accessToken=self` proves ownership of the signed-in user's order. */
export const useGetOrderReceipt = (uid?: string) =>
  useQuery({
    queryKey: ['GET_ORDER_RECEIPT', uid],
    queryFn: async (): Promise<OrderReceipt> =>
      (await axios.get(`/orders/${uid}/receipt`, { params: { accessToken: 'self' } })).data,
    enabled: !!uid,
    // 404 when the order has no payment record: not worth retrying.
    retry: false,
  });

/** Matches `paginationItemsPerPage` on the API's `/customer/{id}/orders`. */
const ORDERS_PAGE_SIZE = 10;

/** `filters` are API Platform filters: `status` (exact, may be an array) and `uid` (partial). Newest first. */
export const useInfiniteUserOrders = ({
  userId,
  filters = {},
}: {
  userId: number;
  filters?: Record<string, string | string[]>;
}) =>
  useInfiniteQuery({
    queryKey: ['GET_USER_ORDERS', userId, 'infinite', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<Order[]> => {
      const response = await axios.get(`/customer/${userId}/orders`, { params: { page: pageParam, ...filters } });
      return response.data['member'];
    },
    getNextPageParam: (lastPage, pages) => (lastPage.length < ORDERS_PAGE_SIZE ? undefined : pages.length + 1),
    enabled: !!userId,
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
