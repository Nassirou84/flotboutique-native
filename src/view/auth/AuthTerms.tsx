import { StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

export function AuthTerms({ action }: { action: string }) {
  return (
    <Text style={styles.text}>
      {action}, vous acceptez les <Text style={styles.link}>Conditions Générales de Vente</Text> et la{' '}
      <Text style={styles.link}>Politique de Confidentialité</Text> de Flot Boutique Côte d’Ivoire.
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13.5, lineHeight: 21, textAlign: 'center', color: colors.textMuted },
  link: { color: colors.text, textDecorationLine: 'underline' },
});
