import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { Order } from '@/types/order';
import { formatLongDate } from '@/utils/format';
import { useCurrency } from '@/providers/currency-provider';

import { completedSteps, DELIVERY_STEPS, STATUS_LABELS } from './constants';
import { OrderProductSummary } from './OrderProductSummary';

export function ActiveOrderCard({ order }: { order: Order }) {
  const { format } = useCurrency();
  const done = completedSteps(order.status);
  const eta = formatLongDate(order.estimatedDeliveryAt);
  const address = [order.street, order.city].filter(Boolean).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.topLine} />

      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.eyebrow}>COMMANDE EN COURS</Text>
          <Text style={styles.reference}>#{order.uid}</Text>
          <Text style={styles.muted}>Passée le {formatLongDate(order.createdAt)}</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{STATUS_LABELS[order.status] ?? order.status}</Text>
        </View>
      </View>

      <View style={styles.product}>
        <OrderProductSummary order={order} size={64}>
          <Text style={styles.price}>{format(order.orderPrice)}</Text>
        </OrderProductSummary>
      </View>

      <View style={styles.logistics}>
        {eta ? (
          <View style={styles.etaRow}>
            <Text style={styles.eta}>Livraison estimée : {eta}</Text>
          </View>
        ) : null}
        {address ? (
          <View style={styles.route}>
            <Ionicons name="navigate-outline" size={16} color={colors.strike} />
            <Text style={[styles.muted, styles.routeText]} numberOfLines={1}>
              {address}
            </Text>
          </View>
        ) : null}

        <View style={styles.stepLabels}>
          {DELIVERY_STEPS.map((step, index) => (
            <Text key={step} style={[styles.stepLabel, index === done - 1 && styles.stepLabelCurrent]} numberOfLines={1}>
              {step}
            </Text>
          ))}
        </View>
        <View style={styles.bars}>
          {DELIVERY_STEPS.map((step, index) => (
            <View key={step} style={[styles.bar, index < done && styles.barDone]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    gap: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  topLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.primary },
  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  headText: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: colors.primary },
  reference: { fontSize: 20, fontWeight: '700', color: colors.text },
  muted: { fontSize: 14, color: colors.textMuted },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  statusText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },
  product: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 8, borderRadius: 8, backgroundColor: '#F1F5FF' },
  price: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: 4 },
  logistics: { gap: 10 },
  etaRow: { flexDirection: 'row' },
  eta: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.orangeSoft,
  },
  route: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  routeText: { flex: 1 },
  stepLabels: { flexDirection: 'row', gap: 4 },
  stepLabel: { flex: 1, fontSize: 10, fontWeight: '600', textAlign: 'center', color: colors.textMuted },
  stepLabelCurrent: { color: colors.primary },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.chipBg },
  barDone: { backgroundColor: colors.primary },
});
