import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

type Props = { subtotal: number; discount: number; shipping: number; total: number };

export function CheckoutTotals({ subtotal, discount, shipping, total }: Props) {
  const { format: money } = useCurrency();
  return (
    <View style={styles.wrap}>
      <Row label="Sous-total" value={money(subtotal)} />
      {discount > 0 ? <Row label="Réduction" value={`− ${money(discount)}`} valueStyle={styles.discount} /> : null}
      <Row label="Livraison" value={shipping > 0 ? money(shipping) : 'Gratuite'} valueStyle={shipping === 0 ? styles.free : undefined} />
      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{money(total)}</Text>
      </View>
    </View>
  );
}

function Row({ label, value, valueStyle }: { label: string; value: string; valueStyle?: object }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
  discount: { color: colors.green },
  free: { color: colors.green },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
});
