import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { colors } from '@/theme/colors';

import { AddressCard } from './AddressCard';
import { useAddresses } from './use-addresses';

const openForm = (index?: number) =>
  router.push({ pathname: '/adresse', params: index === undefined ? {} : { index: String(index) } });

export function AddressesView() {
  const { user, loading, addresses, setDefault, remove, refresh } = useAddresses();
  const { refreshing, refresh: onRefresh } = usePullToRefresh(refresh);

  if (!loading && !user) return <Redirect href="/compte" />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/compte'))}
          hitSlop={8}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Adresses de livraison</Text>
        {addresses.length > 0 ? (
          <Pressable onPress={() => openForm()} hitSlop={8} style={styles.add} accessibilityRole="button">
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.addText}>Ajouter</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }>
        {addresses.map((address, index) => (
          <AddressCard
            key={index}
            address={address}
            onEdit={() => openForm(index)}
            onRemove={() => remove(index)}
            onSetDefault={() => setDefault(index)}
          />
        ))}

        {addresses.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="location-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Aucune adresse de livraison</Text>
            <Text style={styles.emptyText}>Aucune adresse de livraison configurée pour le moment.</Text>
            <Pressable onPress={() => openForm()} style={styles.cta} accessibilityRole="button">
              <Text style={styles.ctaText}>Ajouter une adresse</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  add: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8 },
  addText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  content: { gap: 12, padding: 16, paddingBottom: 32, flexGrow: 1 },
  empty: { alignItems: 'center', gap: 8, padding: 32, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyText: { textAlign: 'center', color: colors.textMuted },
  cta: { marginTop: 8, height: 44, paddingHorizontal: 20, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});
