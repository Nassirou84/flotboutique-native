import { StyleSheet, Text, View } from 'react-native';

import type { OrderReceipt } from '@/api/order/orders';
import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

import { DetailCard, DetailRow } from './DetailCard';

type Props = { total: number; receipt?: OrderReceipt['order'] };

export function OrderTotalsCard({ total, receipt }: Props) {
  const { format } = useCurrency();
  const money = (n: number) => format(Math.round(n));
  const discount = receipt?.discount ?? 0;
  const shipping = receipt?.shipping ?? 0;

  return (
    <DetailCard title="Récapitulatif">
      {receipt ? (
        <>
          <DetailRow label="Sous-total" value={money(receipt.subtotal)} />
          {discount > 0 ? <DetailRow label="Réduction" value={`− ${money(discount)}`} valueStyle={{ color: colors.green }} /> : null}
          <DetailRow
            label={`Livraison ${receipt.shipping_tier === 'Express' ? 'express' : 'standard'}`}
            value={shipping > 0 ? money(shipping) : 'Gratuite'}
            valueStyle={shipping === 0 ? { color: colors.green } : undefined}
          />
          <View style={styles.separator} />
        </>
      ) : null}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{money(total)}</Text>
      </View>
      {receipt?.tax ? (
        <Text style={styles.tax}>
          dont TVA ({receipt.taxRate} %) : {money(receipt.tax)}
        </Text>
      ) : null}
    </DetailCard>
  );
}

const styles = StyleSheet.create({
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 2 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  tax: { fontSize: 12, color: colors.textMuted, textAlign: 'right' },
});
