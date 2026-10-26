import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBasket } from '@/providers/basket-provider';
import { colors } from '@/theme/colors';
import type { BasketItem } from '@/types/basket';

import { BasketEmpty } from './BasketEmpty';
import { BasketHeader } from './BasketHeader';
import { BasketItemCard } from './BasketItemCard';
import { BasketSummary } from './BasketSummary';

const unitPrice = (item: BasketItem) => item.priceAtAdd ?? item.product.actualPrice ?? 0;

export function BasketView() {
  const { items, isHydrated, updateQuantity, removeFromBasket, clearBasket } = useBasket();

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0);

  const confirmClear = () =>
    Alert.alert('Vider le panier', 'Retirer tous les articles du panier ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: () => clearBasket() },
    ]);

  const checkout = () => Alert.alert('Commande', 'Le paiement sera bientôt disponible.');

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
          renderItem={({ item }) => (
            <BasketItemCard
              item={item}
              onChangeQuantity={(i, quantity) => updateQuantity(i.id, quantity)}
              onRemove={(i) => removeFromBasket(i.id)}
            />
          )}
          ListEmptyComponent={<BasketEmpty />}
        />
      )}

      {items.length > 0 ? <BasketSummary itemCount={itemCount} total={total} onCheckout={checkout} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 },
  separator: { height: 12 },
  loading: { marginTop: 48 },
});
