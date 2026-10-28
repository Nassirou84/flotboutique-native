import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';

type Props = { isLoading: boolean; isError: boolean; error: unknown; onRetry: () => void };

/** What the list shows when it has no products: loading, a failed request or no match. */
export function CatalogueEmpty({ isLoading, isError, error, onRetry }: Props) {
  if (isLoading) {
    return (
      <View style={styles.grid}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.row}>
            <View style={styles.cell}>
              <ProductCardSkeleton />
            </View>
            <View style={styles.cell}>
              <ProductCardSkeleton />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.empty}>
        <Text style={styles.text}>{getErrorMessage(error, 'Impossible de charger les produits.')}</Text>
        <Pressable onPress={onRetry} style={styles.retry} accessibilityRole="button">
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return <Text style={[styles.empty, styles.text]}>Aucun produit ne correspond à votre recherche.</Text>;
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', padding: 32, gap: 12 },
  grid: { paddingHorizontal: 8 },
  row: { flexDirection: 'row' },
  cell: { flex: 1, padding: 8 },
  text: { textAlign: 'center', color: colors.textMuted },
  retry: { paddingHorizontal: 16, height: 36, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  retryText: { color: '#fff', fontWeight: '700' },
});
