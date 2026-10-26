import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/format';

type Props = { price?: number; oldPrice?: number; available?: boolean };

export function ProductPriceCard({ price, oldPrice, available = true }: Props) {
  const discount = oldPrice && price ? Math.round((1 - price / oldPrice) * 100) : undefined;

  return (
    <View style={styles.card}>
      <Text style={styles.price}>{price != null ? `${formatPrice(price)} FCFA` : 'Prix sur demande'}</Text>
      {oldPrice ? (
        <View style={styles.oldRow}>
          <Text style={styles.oldPrice}>{formatPrice(oldPrice)} FCFA</Text>
          {discount ? (
            <View style={styles.discount}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={styles.foot}>
        <Text style={styles.note}>Prix net TTC complet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: 12, marginHorizontal: 16, padding: 16, gap: 6 },
  price: { fontSize: 32, fontWeight: '800', color: '#1D4ED8' },
  oldRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  oldPrice: { fontSize: 16, color: colors.strike, textDecorationLine: 'line-through' },
  discount: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  discountText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 4 },
  note: { flex: 1, fontSize: 12.5, color: colors.text },
  stock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stockText: { fontSize: 12.5, fontWeight: '600', color: colors.primary },
});
