import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  loadingMore: boolean;
  /** How many products are loaded on screen so far. */
  loaded: number;
  /** Total products matching the current search/filters. */
  total: number;
};

export function CatalogueFooter({ loadingMore, loaded, total }: Props) {
  return (
    <View style={styles.footer}>
      {loadingMore ? <ActivityIndicator color={colors.primary} style={styles.more} /> : null}
      {total > 0 ? (
        <Text style={styles.count}>
          Affichage de {loaded} sur {total} produit{total > 1 ? 's' : ''}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  more: { marginBottom: 16 },
  footer: { paddingHorizontal: 16, paddingTop: 16 },
  count: { textAlign: 'center', fontSize: 13, color: colors.textMuted },
});
