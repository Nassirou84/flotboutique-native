import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { MobileProvider } from '@/api/payment-method/payment-methods';
import { colors } from '@/theme/colors';

import { CardForm } from './CardForm';
import { usePaymentMethods } from './use-payment-methods';
import { MobileMoneyForm } from './MobileMoneyForm';

type Tab = 'card' | MobileProvider;

const TABS: { key: Tab; label: string; icon: 'card-outline' | 'phone-portrait-outline' }[] = [
  { key: 'card', label: 'Carte', icon: 'card-outline' },
  { key: 'wave', label: 'Wave', icon: 'phone-portrait-outline' },
  { key: 'orange', label: 'Orange Money', icon: 'phone-portrait-outline' },
];

/** Adds a payment method, or edits a saved card when opened with an `id`. */
export function PaymentMethodFormView() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user, loading, methods, isLoading, add, update } = usePaymentMethods();
  const [tab, setTab] = useState<Tab>('card');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const editing = id === undefined ? undefined : methods.find((m) => m.id === Number(id));
  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/moyens-de-paiement'));

  const runAndClose = async (action: () => Promise<boolean>) => {
    setSubmitting(true);
    try {
      if (await action()) goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{id === undefined ? 'Ajouter un moyen de paiement' : 'Modifier la carte'}</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {id !== undefined && !editing ? (
            isLoading ? (
              <ActivityIndicator color={colors.primary} style={styles.loading} />
            ) : (
              <Text style={styles.notFound}>Ce moyen de paiement est introuvable.</Text>
            )
          ) : editing ? (
            <CardForm
              editing={editing}
              submitting={submitting}
              onSubmit={(v) =>
                runAndClose(() => update(editing.id, { cardHolderName: v.cardHolderName.trim(), expiryDate: v.expiry }))
              }
            />
          ) : (
            <View style={styles.form}>
              <View style={styles.tabs} accessibilityRole="tablist">
                {TABS.map((t) => {
                  const selected = t.key === tab;
                  return (
                    <Pressable
                      key={t.key}
                      onPress={() => setTab(t.key)}
                      style={[styles.tab, selected && styles.tabActive]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected }}>
                      <Ionicons name={t.icon} size={16} color={selected ? '#fff' : colors.textMuted} />
                      <Text style={[styles.tabText, selected && styles.tabTextActive]} numberOfLines={1}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {tab === 'card' ? (
                <CardForm
                  submitting={submitting}
                  onSubmit={(v) =>
                    runAndClose(() =>
                      add({
                        method: 'card',
                        cardNumber: v.cardNumber.replace(/\s/g, ''),
                        cardHolderName: v.cardHolderName.trim(),
                        expiry: v.expiry,
                        cvv: v.cvv,
                        isDefault: v.isDefault,
                      }),
                    )
                  }
                />
              ) : (
                <MobileMoneyForm
                  // A new key per provider so the number typed for one is not carried over to the other.
                  key={tab}
                  provider={tab}
                  submitting={submitting}
                  onSubmit={(v) => runAndClose(() => add({ method: 'mobile_payment', mobileProvider: tab, ...v }))}
                />
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 16 },
  form: { gap: 16 },
  loading: { marginTop: 32 },
  notFound: { textAlign: 'center', color: colors.textMuted, marginTop: 32 },
  tabs: { flexDirection: 'row', gap: 6 },
  tab: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.chipBg,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { flexShrink: 1, fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
});
