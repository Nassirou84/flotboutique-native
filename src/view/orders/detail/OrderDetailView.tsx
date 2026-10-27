import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetOrder, useGetOrderReceipt } from '@/api/order/orders';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { colors } from '@/theme/colors';

import { OrderDeliveryCard } from './OrderDeliveryCard';
import { OrderDetailHeader } from './OrderDetailHeader';
import { OrderItemsCard } from './OrderItemsCard';
import { OrderPaymentCard } from './OrderPaymentCard';
import { OrderStatusCard } from './OrderStatusCard';
import { OrderTotalsCard } from './OrderTotalsCard';

export function OrderDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch: refetchOrder } = useGetOrder(id);
  const { data: receipt, refetch: refetchReceipt } = useGetOrderReceipt(order?.uid);
  const { refreshing, refresh } = usePullToRefresh(() => Promise.all([refetchOrder(), refetchReceipt()]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <OrderDetailHeader uid={order?.uid} />

      {order ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }>
          <OrderStatusCard order={order} />
          <OrderItemsCard order={order} receiptItems={receipt?.order.items} />
          <OrderDeliveryCard order={order} receipt={receipt?.order} />
          {receipt ? <OrderPaymentCard payment={receipt.order.payment} /> : null}
          <OrderTotalsCard total={order.orderPrice} receipt={receipt?.order} />
        </ScrollView>
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <View style={styles.error}>
          <Text style={styles.errorText}>{isError ? 'Impossible de charger cette commande.' : 'Commande introuvable.'}</Text>
          <Pressable onPress={() => refetchOrder()} style={styles.retry} accessibilityRole="button">
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { gap: 12, paddingBottom: 32 },
  loading: { marginTop: 48 },
  error: { alignItems: 'center', gap: 12, padding: 32 },
  errorText: { color: colors.textMuted, textAlign: 'center' },
  retry: { height: 44, paddingHorizontal: 20, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  retryText: { color: '#fff', fontWeight: '700' },
});
