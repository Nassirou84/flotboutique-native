import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

type Props = { price?: number; oldPrice?: number; available?: boolean, saveAmount?: number };

export function ProductPriceCard({ price, oldPrice, available = true, saveAmount }: Props) {
  const { format } = useCurrency();
  const discount = oldPrice && price ? Math.round((1 - price / oldPrice) * 100) : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.foot}>
        <Text style={styles.note}>Prix net TTC complet</Text>
      </View>
      <Text style={styles.price}>{price != null ? `${format(price)}` : 'Prix sur demande'}</Text>
      {oldPrice ? (
        <View style={styles.oldRow}>
          <Text style={styles.oldPrice}>{format(oldPrice)}</Text>
          {discount ? (
            <View style={styles.discount}>
              <Text style={styles.discountText}>Vous économisez {saveAmount ? format(saveAmount) : format(oldPrice - (price ?? 0))}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: 12, marginHorizontal: 16, padding: 16, gap: 6 },
  price: { fontSize: 24, fontWeight: '800', color: '#1D4ED8' },
  oldRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  oldPrice: { fontSize: 14, color: colors.strike, textDecorationLine: 'line-through' },
  discount: { backgroundColor: colors.greenSoft, paddingVertical: 2, borderRadius: 6 },
  discountText: { color: colors.green, fontWeight: '700', fontSize: 12 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 4 },
  note: { flex: 1, fontSize: 12.5, color: colors.text },
  stock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stockText: { fontSize: 12.5, fontWeight: '600', color: colors.primary },
});
