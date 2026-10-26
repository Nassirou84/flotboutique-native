import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { Rating } from './Rating';

type Props = { brand?: string; sku?: string; title: string; rating?: number };

export function ProductHeader({ brand, sku, title, rating = 0 }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        {brand ? <Text style={styles.brand}>{brand.toUpperCase()}</Text> : <View />}
        {sku ? <Text style={styles.sku}>SKU: {sku}</Text> : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      {rating > 0 ? <Rating value={rating} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },
  sku: { fontSize: 12, color: colors.text },
  title: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 6, lineHeight: 20 },
});
