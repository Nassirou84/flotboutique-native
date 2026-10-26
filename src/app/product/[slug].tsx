import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetProduct } from '@/api/product/products';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { ProductDetailView, ProductTopBar } from '@/view/products';

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useGetProduct(slug);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {product ? (
        <ProductDetailView product={product} />
      ) : (
        <>
          <ProductTopBar />
          <View style={styles.center}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Text style={styles.muted}>
                  {isError ? getErrorMessage(error, 'Impossible de charger le produit.') : 'Produit introuvable.'}
                </Text>
                {isError ? (
                  <Pressable onPress={() => refetch()} style={styles.retry} accessibilityRole="button">
                    <Text style={styles.retryText}>Réessayer</Text>
                  </Pressable>
                ) : null}
              </>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { color: colors.textMuted, textAlign: 'center' },
  retry: { paddingHorizontal: 16, height: 36, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  retryText: { color: '#fff', fontWeight: '700' },
});
