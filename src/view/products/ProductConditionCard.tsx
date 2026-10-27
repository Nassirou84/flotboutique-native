import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ComponentRef } from 'react';
import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CONDITION_LABELS, type Condition } from '@/data/products';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const CONDITIONS: { key: Condition; text: string; icon: IconName; color: string }[] = [
  {
    key: 'neuf',
    text: 'Produit jamais ouvert, sous emballage d’origine. Garantie constructeur 12 mois.',
    icon: 'cube-outline',
    color: '#1E3A8A',
  },
  {
    key: 'reconditionne',
    text: 'Testé sur 40 points de contrôle, remis à neuf, état esthétique Grade A+.',
    icon: 'sparkles-outline',
    color: '#1D4ED8',
  },
  {
    key: 'occasion',
    text: 'Vérifié et remis en état en atelier, entièrement fonctionnel. Prix imbattable.',
    icon: 'construct-outline',
    color: '#B45309',
  },
];

export function ProductConditionCard({ condition }: { condition: Condition }) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>État du produit</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {CONDITIONS.map((c) => {
          const active = c.key === condition;
          return (
            <View
              key={c.key}
              onLayout={(e) => {
                if (active) scrollRef.current?.scrollTo({ x: Math.max(0, e.nativeEvent.layout.x - 16), animated: false });
              }}
              style={[styles.item, active && { borderColor: c.color, borderWidth: 2 }]}
              accessibilityState={{ selected: active }}>
              <View style={styles.itemHead}>
                <Ionicons name={c.icon} size={18} color={c.color} />
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {CONDITION_LABELS[c.key]}
                </Text>
              </View>
              <Text style={styles.itemText}>{c.text}</Text>
              {active ? (
                <View style={[styles.marker, { backgroundColor: c.color }]}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                  <Text style={styles.markerText}>État de cet article</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: 12, marginHorizontal: 16, paddingVertical: 16, gap: 10 },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, paddingHorizontal: 16 },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 16, gap: 10 },
  item: {
    width: 230,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 12,
    gap: 8,
  },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
  itemText: { fontSize: 12.5, lineHeight: 17, color: colors.textMuted },
  marker: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 'auto',
  },
  markerText: { color: '#fff', fontWeight: '700', fontSize: 11.5 },
});
