import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { OrderReceipt } from '@/api/order/orders';
import { colors } from '@/theme/colors';
import type { Order } from '@/types/order';
import { useCurrency } from '@/providers/currency-provider';

import { ProductThumb } from '../ProductThumb';
import { DetailCard } from './DetailCard';

type Props = { order: Order; receiptItems?: OrderReceipt['order']['items'] };

export function OrderItemsCard({ order, receiptItems }: Props) {
  const { format } = useCurrency();
  const count = order.products.reduce((n, i) => n + i.quantity, 0);

  return (
    <DetailCard title={`Articles (${count})`}>
      {order.products.map((item, index) => {
        const { product } = item;
        // Only the receipt carries the chosen variant; its SKU is `PR-<product id>`.
        const variant = receiptItems?.find((r) => r.sku === `PR-${product.id}`)?.variant;
        const open = () => {
          if (product.slug) router.push({ pathname: '/product/[slug]', params: { slug: product.slug } });
        };

        return (
          <Pressable
            key={item.id}
            onPress={open}
            disabled={!product.slug}
            style={[styles.item, index > 0 && styles.itemBorder]}
            accessibilityRole="button"
            accessibilityLabel={product.title}>
            <ProductThumb size={64} slug={product.slug} />
            <View style={styles.text}>
              <Text style={styles.name} numberOfLines={2}>
                {product.title}
              </Text>
              {variant || product.brand ? (
                <Text style={styles.muted} numberOfLines={1}>
                  {[product.brand, variant].filter(Boolean).join(' • ')}
                </Text>
              ) : null}
              <View style={styles.priceRow}>
                <Text style={styles.muted}>
                  {item.quantity} × {format(item.unitPrice)}
                </Text>
                <Text style={styles.lineTotal}>{format(item.quantity * item.unitPrice)}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </DetailCard>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', gap: 12, paddingTop: 4 },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 12 },
  text: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto' },
  lineTotal: { fontSize: 15, fontWeight: '700', color: colors.text },
});
