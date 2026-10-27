import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { colors } from '@/theme/colors';

import { PaymentMethodCard } from './PaymentMethodCard';
import { usePaymentMethods } from './use-payment-methods';

const openForm = (id?: number) =>
  router.push({ pathname: '/moyen-de-paiement', params: id === undefined ? {} : { id: String(id) } });

export function PaymentMethodsView() {
  const { user, loading, methods, isLoading, isError, refetch, setDefault, remove } = usePaymentMethods();
  const { refreshing, refresh } = usePullToRefresh(refetch);

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
        <Text style={styles.title}>Moyens de paiement</Text>
        {methods.length > 0 ? (
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }>
        <Text style={styles.description}>Gérez vos moyens de paiement enregistrés pour commander plus vite.</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : isError ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Impossible de charger vos moyens de paiement.</Text>
            <Pressable onPress={() => refetch()} style={styles.cta} accessibilityRole="button">
              <Text style={styles.ctaText}>Réessayer</Text>
            </Pressable>
          </View>
        ) : methods.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="card-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Aucun moyen de paiement</Text>
            <Text style={styles.emptyText}>Ajoutez une carte bancaire, Wave ou Orange Money.</Text>
            <Pressable onPress={() => openForm()} style={styles.cta} accessibilityRole="button">
              <Text style={styles.ctaText}>Ajouter un moyen de paiement</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.count}>
              <Text style={styles.countText}>
                {methods.length} enregistré{methods.length > 1 ? 's' : ''}
              </Text>
            </View>
            {methods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onEdit={() => openForm(method.id)}
                onRemove={() => remove(method.id)}
                onSetDefault={() => setDefault(method.id)}
              />
            ))}
          </>
        )}

        <View style={styles.security}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <Text style={styles.securityText}>
            Le numéro de carte est chiffré et le code CVV n’est jamais enregistré. Le paiement à la livraison reste
            disponible à tout moment.
          </Text>
        </View>
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
  content: { gap: 12, padding: 16, paddingBottom: 32 },
  description: { fontSize: 14, color: colors.textMuted },
  loading: { marginTop: 32 },
  count: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.chipBg },
  countText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
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
  security: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 8, backgroundColor: colors.primarySoft },
  securityText: { flex: 1, fontSize: 12, lineHeight: 17, color: colors.text },
});
