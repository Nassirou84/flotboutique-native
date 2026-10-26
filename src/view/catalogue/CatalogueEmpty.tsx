import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';

type Props = { isLoading: boolean; isError: boolean; error: unknown; onRetry: () => void };

/** What the list shows when it has no products: loading, a failed request or no match. */
export function CatalogueEmpty({ isLoading, isError, error, onRetry }: Props) {
  if (isLoading) return <ActivityIndicator style={styles.empty} color={colors.primary} />;

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
  text: { textAlign: 'center', color: colors.textMuted },
  retry: { paddingHorizontal: 16, height: 36, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  retryText: { color: '#fff', fontWeight: '700' },
});
