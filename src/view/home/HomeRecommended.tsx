import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';

import { HomeProductItem } from './HomeProductItem';
import { HomeSection } from './HomeSection';
import { goToCatalogue } from './navigation';
import { useRecommendedProducts } from './use-recommended-products';

export function HomeRecommended() {
  const { products, isLoading, isError, error, refetch } = useRecommendedProducts();
  const rows = [products.slice(0, 2), products.slice(2, 4)];

  return (
    <HomeSection
      title="Sélection Recommandée"
      action={{ label: 'Tout voir', icon: 'chevron-forward', onPress: () => goToCatalogue() }}>
      {isLoading ? <ActivityIndicator color={colors.primary} style={styles.status} /> : null}
      {isError ? (
        <View style={styles.status}>
          <Text style={styles.statusText}>{getErrorMessage(error, 'Impossible de charger les produits.')}</Text>
          <Pressable onPress={() => refetch()} accessibilityRole="button">
            <Text style={styles.retry}>Réessayer</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.grid}>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((p) => (
              <HomeProductItem key={p.id} product={p} />
            ))}
          </View>
        ))}
      </View>
    </HomeSection>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  status: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  statusText: { color: colors.textMuted, textAlign: 'center' },
  retry: { fontSize: 13, fontWeight: '600', color: '#1D4ED8' },
});
