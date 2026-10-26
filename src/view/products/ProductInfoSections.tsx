import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { Product } from '@/types/product';

import { ProductAccordion } from './ProductAccordion';
import { Rating } from './Rating';

export function ProductInfoSections({ product }: { product: Product }) {
  const details = (product.details ?? []).filter((d) => d.name && d.value);
  const rating = product.overallRating ?? 0;

  return (
    <View style={styles.wrap}>
      {product.description || product.features?.length ? (
        <ProductAccordion icon="document-text-outline" title="Description" defaultOpen>
          {product.description ? <Text style={styles.body}>{product.description}</Text> : null}
          {product.features?.map((f, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={[styles.body, styles.bulletText]}>{f}</Text>
            </View>
          ))}
        </ProductAccordion>
      ) : null}
      {details.length > 0 ? (
        <ProductAccordion icon="hardware-chip-outline" title="Fiche technique complète">
          {details.map((d, i) => (
            <View key={i} style={styles.specRow}>
              <Text style={styles.specName}>{String(d.name)}</Text>
              <Text style={styles.specValue}>{String(d.value)}</Text>
            </View>
          ))}
        </ProductAccordion>
      ) : null}
      {product.customerSays ? (
        <ProductAccordion icon="chatbubble-ellipses-outline" title="Avis clients">
          {rating > 0 ? <Rating value={rating} /> : null}
          <Text style={styles.body}>{product.customerSays}</Text>
        </ProductAccordion>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, gap: 12 },
  body: { fontSize: 14, lineHeight: 21, color: colors.text },
  bulletRow: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 14, color: colors.primary },
  bulletText: { flex: 1 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 4 },
  specName: { flex: 1, fontSize: 13.5, color: colors.textMuted },
  specValue: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text, textAlign: 'right' },
});
