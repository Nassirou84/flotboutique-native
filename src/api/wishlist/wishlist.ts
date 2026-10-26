import { useMutation, useQuery } from '@tanstack/react-query';

import axios from '@/api/client';
import { getErrorMessage } from '@/utils/errors';
import type { WishlistItem } from '@/types/wishlist';

export const getUserWishlistQueryKey = (userId: number) => ['user-wishlist', userId] as const;

export const useGetUserWishlist = (userId: number) =>
  useQuery({
    queryKey: getUserWishlistQueryKey(userId),
    enabled: !!userId,
    staleTime: 0,
    queryFn: async (): Promise<{ member: WishlistItem[] }> => {
      try {
        return (await axios.get(`/customer/${userId}/wishlists`)).data;
      } catch (error) {
        throw new Error(getErrorMessage(error, 'Une erreur est survenue lors de la récupération de la liste de souhaits.'));
      }
    },
  });

/** `productIri` is the product's JSON-LD `@id`, e.g. `/api/products/1`. */
export const useAddToWishlist = () =>
  useMutation({
    mutationFn: async (productIri: string): Promise<WishlistItem> => {
      try {
        return (await axios.post('/wishlists', { product: productIri })).data;
      } catch (error) {
        throw new Error(getErrorMessage(error, "Une erreur est survenue lors de l'ajout à la liste de souhaits."));
      }
    },
  });

export const useRemoveFromWishlist = () =>
  useMutation({
    mutationFn: async (wishlistItemId: string) => {
      try {
        return (await axios.delete(`/wishlists/${wishlistItemId}`)).data;
      } catch (error) {
        throw new Error(getErrorMessage(error, "Une erreur est survenue lors de la suppression de l'article."));
      }
    },
  });

export const useRemoveProductFromWishlist = () =>
  useMutation({
    mutationFn: async (productId: number) => {
      try {
        return (await axios.post('/wishlist/remove-product', { productId })).data;
      } catch (error) {
        throw new Error(getErrorMessage(error, "Une erreur est survenue lors de la suppression de l'article."));
      }
    },
  });
