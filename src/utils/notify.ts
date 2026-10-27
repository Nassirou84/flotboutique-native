import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { toast } from 'react-native-pretty-toast';

export const notifyError = (message: string, title = 'Erreur') => Alert.alert(title, message);

/** Tells a guest the action needs an account, and offers to go to the sign-in page. */
export const notifySignIn = (message: string, title = 'Connexion requise') =>
  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Se connecter', onPress: () => router.navigate('/connexion') },
  ]);

/** Shows a toast with a unique id; returns it so the toast can be updated or dismissed later. */
export const notifySuccess = (title: string, message?: string, duration = 2000) =>
  toast.show({ id: Crypto.randomUUID(), title, message, duration });
