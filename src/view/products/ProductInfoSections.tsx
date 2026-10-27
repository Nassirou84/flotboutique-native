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
          <Text style={styles.note}>Note : cette description peut contenir du contenu généré par IA.</Text>
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
      <ProductAccordion icon="chatbubble-ellipses-outline" title="Avis clients">
        <Rating value={rating} />
        {product.customerSays ? (
          <Text style={styles.body}>{product.customerSays}</Text>
        ) : (
          <Text style={[styles.body, styles.placeholder]}>
            Aucun avis pour le moment. Les avis des clients s’afficheront ici.
          </Text>
        )}
      </ProductAccordion>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, gap: 12 },
  body: { fontSize: 14, lineHeight: 21, color: colors.text },
  note: { fontSize: 12, lineHeight: 17, fontStyle: 'italic', color: colors.textMuted, marginTop: 4 },
  placeholder: { fontStyle: 'italic', color: colors.textMuted },
  bulletRow: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 14, color: colors.primary },
  bulletText: { flex: 1 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 4 },
  specName: { flex: 1, fontSize: 13.5, color: colors.textMuted },
  specValue: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text, textAlign: 'right' },
});
