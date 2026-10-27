import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetCategories } from '@/api/categories/categories';
import { useCurrency } from '@/providers/currency-provider';
import { colors } from '@/theme/colors';
import { notifyError } from '@/utils/notify';

import { EMPTY_FILTERS, SORT_LABELS, SORT_ORDER, countActiveFilters } from './constants';
import { getFiltersState, setFiltersState } from './filters-store';

const digitsOnly = (v: string) => v.replace(/\D/g, '');

const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/catalogue'));

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Ionicons name={icon} size={18} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/** Full-page filters, like the web storefront's panel: sort, categories with subcategories and a price range. */
export function CatalogueFiltersView() {
  // Opened from the home page, applying leads to the catalogue (with the search typed there).
  const { from, q } = useLocalSearchParams<{ from?: string; q?: string }>();
  const { currency } = useCurrency();
  const { data: categories = [], isLoading } = useGetCategories();

  // Edit a copy: the catalogue only changes on "Appliquer"; leaving the page discards it.
  const [draft, setDraft] = useState(() => getFiltersState().filters);
  const [sort, setSort] = useState(() => getFiltersState().sort);
  const [expanded, setExpanded] = useState<string | null>(() => getFiltersState().filters.category || null);

  const active = countActiveFilters(draft);

  const select = (category: string, subcategory = '') =>
    setDraft((d) =>
      d.category === category && d.subcategory === subcategory
        ? { ...d, category: '', subcategory: '' }
        : { ...d, category, subcategory },
    );

  const reset = () => {
    setDraft(EMPTY_FILTERS);
    setSort('newest');
    setExpanded(null);
  };

  const apply = () => {
    if (draft.minPrice && draft.maxPrice && Number(draft.minPrice) > Number(draft.maxPrice)) {
      notifyError('Le prix minimum doit être inférieur au prix maximum.');
      return;
    }
    setFiltersState({ filters: draft, sort });
    if (from === 'home') router.navigate({ pathname: '/catalogue', params: q ? { q } : {} });
    else goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          hitSlop={8}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Filtres</Text>
        {active > 0 || sort !== 'newest' ? (
          <Pressable onPress={reset} hitSlop={8} style={styles.reset} accessibilityRole="button">
            <Ionicons name="refresh" size={14} color={colors.primary} />
            <Text style={styles.resetText}>Réinitialiser</Text>
          </Pressable>
        ) : null}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Section title="Trier par" icon="swap-vertical">
            {SORT_ORDER.map((s) => {
              const selected = s === sort;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSort(s)}
                  style={styles.option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>{SORT_LABELS[s]}</Text>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selected ? colors.primary : colors.strike}
                  />
                </Pressable>
              );
            })}
          </Section>

          <Section title="Catégories" icon="grid-outline">
            {isLoading ? <Text style={styles.muted}>Chargement…</Text> : null}
            {categories.map((category) => {
              const subs = category.subcategories ?? [];
              const selected = draft.category === category.title;
              const open = expanded === category.title;
              return (
                <View key={category.id}>
                  <Pressable
                    onPress={() =>
                      subs.length === 0 ? select(category.title) : setExpanded(open ? null : category.title)
                    }
                    style={[styles.option, selected && !draft.subcategory && styles.optionSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: subs.length > 0 ? open : undefined, selected }}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextActive]} numberOfLines={1}>
                      {category.title}
                    </Text>
                    {subs.length > 0 ? (
                      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
                    ) : selected ? (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>

                  {open ? (
                    <View style={styles.subs}>
                      <Pressable onPress={() => select(category.title)} style={styles.subRow}>
                        <Text style={[styles.subText, styles.subAll]}>Tous les produits</Text>
                        {selected && !draft.subcategory ? (
                          <Ionicons name="checkmark" size={16} color={colors.primary} />
                        ) : null}
                      </Pressable>
                      {subs.map((sub) => {
                        const on = selected && draft.subcategory === sub.title;
                        return (
                          <Pressable
                            key={sub.id}
                            onPress={() => select(category.title, sub.title)}
                            style={styles.subRow}
                          >
                            <Text style={[styles.subText, on && styles.optionTextActive]}>{sub.title}</Text>
                            {on ? <Ionicons name="checkmark" size={16} color={colors.primary} /> : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </Section>

          <Section title={`Fourchette de prix (${currency})`} icon="cash-outline">
            <View style={styles.priceRow}>
              <TextInput
                value={draft.minPrice}
                onChangeText={(v) => setDraft((d) => ({ ...d, minPrice: digitsOnly(v) }))}
                placeholder="Min"
                placeholderTextColor={colors.strike}
                keyboardType="number-pad"
                style={styles.input}
                accessibilityLabel="Prix minimum"
              />
              <Text style={styles.dash}>–</Text>
              <TextInput
                value={draft.maxPrice}
                onChangeText={(v) => setDraft((d) => ({ ...d, maxPrice: digitsOnly(v) }))}
                placeholder="Max"
                placeholderTextColor={colors.strike}
                keyboardType="number-pad"
                style={styles.input}
                accessibilityLabel="Prix maximum"
              />
            </View>
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={apply}
            style={({ pressed }) => [styles.apply, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
          >
            <Text style={styles.applyText}>Appliquer{active > 0 ? ` (${active})` : ''}</Text>
          </Pressable>
        </View>
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
  reset: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  resetText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  content: { gap: 12, padding: 16, paddingBottom: 24 },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionSelected: { backgroundColor: colors.primarySoft },
  optionText: { flex: 1, fontSize: 15, color: colors.textMuted },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
  muted: { fontSize: 13, color: colors.textMuted },
  subs: { marginLeft: 18, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: colors.border },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    paddingHorizontal: 8,
  },
  subText: { fontSize: 14, color: colors.textMuted },
  subAll: { fontWeight: '600', color: colors.primary },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  dash: { color: colors.textMuted },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  apply: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
