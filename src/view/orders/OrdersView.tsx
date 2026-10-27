import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { colors } from '@/theme/colors';
import { GuestAccount } from '@/view/account/GuestAccount';

import { ActiveOrderCard } from './ActiveOrderCard';
import { isActiveStatus } from './constants';
import { OrderHistoryCard } from './OrderHistoryCard';
import { OrdersEmpty } from './OrdersEmpty';
import { OrdersHeader } from './OrdersHeader';
import { OrdersSearchBar } from './OrdersSearchBar';
import { OrdersSupportCard } from './OrdersSupportCard';
import { OrdersTabs } from './OrdersTabs';
import { useOrders } from './use-orders';

export function OrdersView() {
  const o = useOrders();
  const { refreshing, refresh } = usePullToRefresh(o.refetch);

  if (!o.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <GuestAccount />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <OrdersHeader />
      <OrdersSearchBar value={o.query} onChangeText={o.setQuery} />
      <OrdersTabs active={o.tab} onChange={o.setTab} counts={o.counts} />

      {o.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : o.isError ? (
        <View style={styles.error}>
          <Text style={styles.errorText}>Impossible de charger vos commandes.</Text>
          <Pressable onPress={() => o.retry()} style={styles.retry} accessibilityRole="button">
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={o.orders}
          style={styles.list}
          keyExtractor={(order) => String(order.id)}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/commande/[id]', params: { id: String(item.id) } })}
              accessibilityRole="button"
              accessibilityLabel={`Commande ${item.uid}, voir le détail`}>
              {isActiveStatus(item.status) ? <ActiveOrderCard order={item} /> : <OrderHistoryCard order={item} />}
            </Pressable>
          )}
          onEndReached={() => {
            if (o.hasNextPage && !o.isFetchingNextPage) o.fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<OrdersEmpty filtered={o.tab !== 'all' || o.query.trim() !== ''} />}
          ListFooterComponent={
            <View style={styles.footer}>
              {o.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
              <OrdersSupportCard />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  separator: { height: 12 },
  footer: { gap: 12, paddingTop: 12 },
  loading: { marginTop: 48 },
  error: { alignItems: 'center', gap: 12, padding: 32 },
  errorText: { color: colors.textMuted, textAlign: 'center' },
  retry: { height: 44, paddingHorizontal: 20, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  retryText: { color: '#fff', fontWeight: '700' },
});
