import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-provider';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useWishlist } from '@/providers/wishlist-provider';
import { colors } from '@/theme/colors';

import { WishlistEmpty } from './WishlistEmpty';
import { WishlistHeader } from './WishlistHeader';
import { WishlistItemCard } from './WishlistItemCard';

export function WishlistView() {
  const { authenticated } = useAuth();
  const { wishlist, isLoading, removeFromWishlist, refresh } = useWishlist();
  const { refreshing, refresh: onRefresh } = usePullToRefresh(refresh);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <WishlistHeader count={wishlist.length} />

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            authenticated ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            ) : undefined
          }
          renderItem={({ item }) => <WishlistItemCard item={item} onRemove={removeFromWishlist} />}
          ListEmptyComponent={<WishlistEmpty signedIn={authenticated} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  separator: { height: 12 },
  loading: { marginTop: 48 },
});
