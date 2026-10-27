import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import {
  deletePaymentMethod,
  editPaymentMethod,
  paymentErrorMessage,
  paymentMethodsQueryKey,
  savePaymentMethod,
  useGetPaymentMethods,
  type NewPaymentMethod,
} from '@/api/payment-method/payment-methods';
import { useAuth } from '@/auth/auth-provider';
import { notifyError, notifySuccess } from '@/utils/notify';

/** Saved payment methods of the signed-in user, with the actions of the web storefront's payment page. */
export function usePaymentMethods() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? 0;
  const query = useGetPaymentMethods(userId);

  const run = async (action: () => Promise<void>, success: string, failure: string) => {
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey(userId) });
      notifySuccess(success);
      return true;
    } catch (error) {
      notifyError(paymentErrorMessage(error, failure));
      return false;
    }
  };

  return {
    user,
    loading,
    methods: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    add: (data: NewPaymentMethod) =>
      run(() => savePaymentMethod(data), 'Méthode de paiement enregistrée avec succès', "Erreur lors de l'enregistrement de la méthode de paiement"),
    update: (id: number, data: Parameters<typeof editPaymentMethod>[1]) =>
      run(() => editPaymentMethod(id, data), 'Méthode de paiement modifiée avec succès', 'Erreur lors de la modification de la méthode de paiement'),
    setDefault: (id: number) =>
      run(() => editPaymentMethod(id, { isDefault: true }), 'Méthode de paiement par défaut mise à jour', 'Erreur lors de la modification de la méthode de paiement'),
    remove: (id: number) =>
      Alert.alert(
        'Supprimer la méthode de paiement',
        'Cette méthode de paiement sera retirée de votre compte. Cette action est irréversible.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              run(() => deletePaymentMethod(id), 'Méthode de paiement supprimée avec succès', 'Erreur lors de la suppression de la méthode de paiement');
            },
          },
        ],
      ),
  };
}
