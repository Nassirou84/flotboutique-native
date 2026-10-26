import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Condition } from '@/data/products';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const ITEMS: { key: Condition; label: string; text: string; icon: IconName; color: string }[] = [
  {
    key: 'neuf',
    label: 'Neuf Scellé',
    text: 'Garantie constructeur 12 mois',
    icon: 'checkmark-circle-outline',
    color: '#1E3A8A',
  },
  {
    key: 'reconditionne',
    label: 'Reconditionné A+',
    text: 'Testé 40 pts, Grade A+',
    icon: 'sparkles-outline',
    color: '#1D4ED8',
  },
  {
    key: 'occasion',
    label: 'Occasion',
    text: '100% atelier, prix imbattable',
    icon: 'checkmark-circle-outline',
    color: '#B45309',
  },
];

export function ConditionCards({ onSelect }: { onSelect: (c: Condition) => void }) {
  return (
    <View style={styles.row}>
      {ITEMS.map((i) => (
        <Pressable
          key={i.key}
          onPress={() => onSelect(i.key)}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel={i.label}>
          <View style={[styles.bar, { backgroundColor: i.color }]} />
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Ionicons name={i.icon} size={16} color={i.color} />
              <Text style={styles.label} numberOfLines={1}>
                {i.label}
              </Text>
            </View>
            <Text style={styles.text} numberOfLines={2}>
              {i.text}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bar: { height: 3 },
  body: { padding: 10, gap: 6, minHeight: 74 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { flex: 1, fontSize: 12.5, fontWeight: '700', color: colors.text },
  text: { fontSize: 11.5, lineHeight: 15, color: colors.textMuted },
});
