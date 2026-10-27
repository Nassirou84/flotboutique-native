import { Alert } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import type { Address } from '@/types/user';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

/**
 * Delivery addresses of the signed-in user. Like the web storefront, every change sends the whole
 * list to `/edit-me`, and the default address is the only one flagged `isDefault`.
 */
export function useAddresses() {
  const { user, loading, updateAddresses, refreshUser } = useAuth();
  const addresses = user?.addresses ?? [];

  const persist = async (next: Address[], success: string, failure: string) => {
    try {
      await updateAddresses(next);
      notifySuccess(success);
      return true;
    } catch (error) {
      notifyError(getErrorMessage(error, failure));
      return false;
    }
  };

  /** Adds the address, or replaces the one at `index`. Resolves to whether it was saved. */
  const save = (address: Address, index?: number) => {
    // Only one default: flagging this address clears the flag on the others.
    const next = address.isDefault ? addresses.map((a) => ({ ...a, isDefault: false })) : [...addresses];
    if (index === undefined) next.push(address);
    else next[index] = address;
    return persist(next, index === undefined ? 'Adresse ajoutée avec succès' : 'Adresse mise à jour', "Échec de la mise à jour de l'adresse");
  };

  const setDefault = (index: number) =>
    persist(
      addresses.map((a, i) => ({ ...a, isDefault: i === index })),
      'Adresse par défaut définie avec succès',
      "Échec de la définition de l'adresse par défaut",
    );

  const remove = (index: number) => {
    if (addresses.length === 1) {
      notifyError("Impossible de supprimer la dernière adresse. Ajoutez-en une nouvelle avant de supprimer celle-ci.");
      return;
    }
    if (addresses[index].isDefault) {
      notifyError("Impossible de supprimer l'adresse par défaut. Définissez-en une autre par défaut avant de supprimer celle-ci.");
      return;
    }
    Alert.alert(
      "Supprimer l'adresse",
      'Êtes-vous sûr de vouloir supprimer cette adresse de livraison de votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            persist(
              addresses.filter((_, i) => i !== index),
              'Adresse supprimée avec succès',
              "Échec de la suppression de l'adresse",
            );
          },
        },
      ],
    );
  };

  /** Reloads the user, e.g. addresses saved from another device. A failure leaves the session alone. */
  const refresh = async () => {
    try {
      await refreshUser();
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de mettre à jour vos informations.'));
    }
  };

  return { user, loading, addresses, save, setDefault, remove, refresh };
}
