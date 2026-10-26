import { useMutation, useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import type { Basket, BasketItem } from '@/types/basket';

// --- Authenticated basket -------------------------------------------------------------------

export const getUserBasketQueryKey = (userId: number) => ['userBasket', userId];

export const useGetUserBasket = (userId: number) =>
  useQuery({
    queryKey: getUserBasketQueryKey(userId),
    queryFn: async () => {
      const response = await axios.get(`/customer/${userId}/baskets`);
      return response.data.member[0] as Basket;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

// --- Guest basket (tracked server-side by session cookie) -----------------------------------

export const GUEST_BASKET_QUERY_KEY = ['guestBasket'];

export const getGuestBasket = async () => (await axios.get('/guest/basket')).data;

export const useGetGuestBasket = () => useQuery({ queryKey: GUEST_BASKET_QUERY_KEY, queryFn: getGuestBasket });

export const useMergeGuestBasket = () =>
  useMutation({ mutationFn: async () => (await axios.post('/basket/merge-guest-basket', {})).data });

// --- Mutations (work for both guests and signed-in users) -----------------------------------

type ApiResult = { success: boolean; message?: string };

const assertSuccess = (data: ApiResult, fallback: string) => {
  if (!data.success) throw new Error(data.message || fallback);
};

export const useAddToBasket = () =>
  useMutation({
    mutationFn: async (data: { productId: string | number; quantity: number; variant?: string }) => {
      const response = await axios.post('/basket/add', data);
      assertSuccess(response.data, "Impossible d'ajouter le produit au panier. Veuillez réessayer.");
      return response.data.basketItem as BasketItem;
    },
  });

export const useUpdateBasketQuantity = () =>
  useMutation({
    mutationFn: async (data: { productId: string | number; quantity: number; variant?: string }) => {
      const response = await axios.post(`/basket/update-quantity/${data.productId}`, data);
      assertSuccess(response.data, 'Impossible de mettre à jour la quantité. Veuillez réessayer.');
      return response.data.newQuantity as number;
    },
  });

export const useRemoveFromBasket = () =>
  useMutation({
    mutationFn: async (data: { productId: string | number; variant?: string }) => {
      const response = await axios.post(`/basket/remove/${data.productId}`, data);
      assertSuccess(response.data, 'Impossible de supprimer le produit du panier. Veuillez réessayer.');
      return response.data.basketItem as BasketItem;
    },
  });

export const useClearBasket = () =>
  useMutation({
    mutationFn: async () => {
      const response = await axios.post('/basket/clear', {});
      assertSuccess(response.data, 'Impossible de vider le panier. Veuillez réessayer.');
      return response.data.basketItems as BasketItem[];
    },
  });

export const useMoveToBasket = () =>
  useMutation({
    mutationFn: async (data: { whishList: string | number; quantity: number; variant?: string }) => {
      const response = await axios.post(`/basket/move-to-basket/${data.whishList}`, data);
      assertSuccess(response.data, 'Impossible de déplacer le produit vers le panier. Veuillez réessayer.');
      return response.data.newQuantity as number;
    },
  });
