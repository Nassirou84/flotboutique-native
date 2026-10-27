import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { OrderStatus, type Order } from '@/types/order';
import { formatLongDate } from '@/utils/format';
import { useCurrency } from '@/providers/currency-provider';

import { OrderProductSummary } from './OrderProductSummary';

export function OrderHistoryCard({ order }: { order: Order }) {
  const { format } = useCurrency();
  const cancelled = order.status === OrderStatus.CANCELLED;
  const slug = order.products[0]?.product.slug;
  // The API does not expose a delivery date; `updatedAt` is when the status last changed.
  const date = formatLongDate(order.updatedAt);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.reference}>#{order.uid}</Text>
          <Text style={styles.muted}>
            {cancelled ? 'Annulée' : 'Livrée'} le {date}
          </Text>
        </View>
        <View style={[styles.status, cancelled && styles.statusCancelled]}>
          <Ionicons
            name={cancelled ? 'close-circle' : 'checkmark-circle'}
            size={14}
            color={cancelled ? colors.danger : colors.primary}
          />
          <Text style={[styles.statusText, cancelled && { color: colors.danger }]}>
            {cancelled ? 'Annulée' : 'Livrée avec succès'}
          </Text>
        </View>
      </View>

      <View style={styles.product}>
        <OrderProductSummary order={order} size={56}>
          <Text style={styles.price}>{format(order.orderPrice)}</Text>
        </OrderProductSummary>
      </View>

      {slug ? (
        <Pressable
          onPress={() => router.push({ pathname: '/product/[slug]', params: { slug } })}
          style={styles.action}
          accessibilityRole="button">
          <Ionicons name="cube-outline" size={18} color="#1D4ED8" />
          <Text style={styles.actionText}>Voir le produit</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    gap: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  headText: { flex: 1, gap: 2 },
  reference: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  muted: { fontSize: 14, color: colors.textMuted },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  statusCancelled: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  product: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  price: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 },
  action: {
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
  },
  actionText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },
});
