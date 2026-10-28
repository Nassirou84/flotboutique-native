import { router } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useBasket } from '@/providers/basket-provider';
import { colors } from '@/theme/colors';

import { BasketEmpty } from './BasketEmpty';
import { BasketHeader } from './BasketHeader';
import { BasketItemCard } from './BasketItemCard';
import { BasketRecap } from './BasketRecap';
import { BasketSummary } from './BasketSummary';

export function BasketView() {
  const { items, total, isHydrated, updateQuantity, removeFromBasket, clearBasket, refresh } = useBasket();
  const { refreshing, refresh: onRefresh } = usePullToRefresh(refresh);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  const confirmClear = () =>
    Alert.alert('Vider le panier', 'Retirer tous les articles du panier ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: () => clearBasket() },
    ]);

  const checkout = () => router.navigate('/checkout');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BasketHeader count={itemCount} onClear={items.length > 0 ? confirmClear : undefined} />

      {!isHydrated ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <BasketItemCard
              item={item}
              onChangeQuantity={(i, quantity) => updateQuantity(i.id, quantity)}
              onRemove={(i) => removeFromBasket(i.id)}
            />
          )}
          ListEmptyComponent={<BasketEmpty />}
          ListFooterComponent={items.length > 0 ? <BasketRecap itemCount={itemCount} total={total} /> : undefined}
          ListFooterComponentStyle={styles.footer}
        />
      )}

      {items.length > 0 ? <BasketSummary total={total} onCheckout={checkout} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 },
  separator: { height: 12 },
  footer: { marginTop: 12 },
  loading: { marginTop: 48 },
});
