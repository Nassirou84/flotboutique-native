import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { Order } from '@/types/order';

import { ProductThumb } from './ProductThumb';

type Props = { order: Order; size: number; children?: ReactNode };

/** First product of the order, with how many other items it holds. */
export function OrderProductSummary({ order, size, children }: Props) {
  const [first] = order.products;
  const others = order.products.length - 1;
  const quantity = order.products.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      <ProductThumb size={size} slug={first?.product.slug} />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {first?.product.title ?? 'Commande'}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {others > 0 ? `+ ${others} autre${others > 1 ? 's' : ''} produit${others > 1 ? 's' : ''}` : first?.product.brand ?? ''}
          {first ? `${others > 0 || first.product.brand ? ' • ' : ''}Qté : ${quantity}` : ''}
        </Text>
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  muted: { fontSize: 14, color: colors.textMuted },
});
