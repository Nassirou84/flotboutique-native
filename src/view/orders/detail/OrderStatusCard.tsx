import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { OrderStatus, type Order } from '@/types/order';
import { formatLongDate } from '@/utils/format';

import { completedSteps, DELIVERY_STEPS, STATUS_LABELS } from '../constants';

export function OrderStatusCard({ order }: { order: Order }) {
  const cancelled = order.status === OrderStatus.CANCELLED;
  const done = completedSteps(order.status);
  const eta = formatLongDate(order.estimatedDeliveryAt);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.muted}>Passée le {formatLongDate(order.createdAt)}</Text>
          {!cancelled && order.status !== OrderStatus.DELIVERED && eta ? (
            <Text style={styles.eta}>Livraison estimée : {eta}</Text>
          ) : null}
        </View>
        <View style={[styles.pill, cancelled && styles.pillCancelled]}>
          <View style={[styles.dot, cancelled && { backgroundColor: colors.danger }]} />
          <Text style={[styles.pillText, cancelled && { color: colors.danger }]}>
            {STATUS_LABELS[order.status] ?? order.status}
          </Text>
        </View>
      </View>

      {cancelled ? null : (
        <View style={styles.progress}>
          <View style={styles.labels}>
            {DELIVERY_STEPS.map((step, index) => (
              <Text key={step} style={[styles.label, index === done - 1 && styles.labelCurrent]} numberOfLines={1}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 16,
    gap: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  headText: { flex: 1, gap: 6 },
  muted: { fontSize: 14, color: colors.textMuted },
  eta: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.orangeSoft,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  pillCancelled: { backgroundColor: '#FEE2E2' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  pillText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },
  progress: { gap: 10 },
  labels: { flexDirection: 'row', gap: 4 },
  label: { flex: 1, fontSize: 10, fontWeight: '600', textAlign: 'center', color: colors.textMuted },
  labelCurrent: { color: colors.primary },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.chipBg },
  barDone: { backgroundColor: colors.primary },
});
