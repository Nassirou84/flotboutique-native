import { Alert } from 'react-native';

export const notifyError = (message: string, title = 'Erreur') => Alert.alert(title, message);
