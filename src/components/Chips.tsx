import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type CategoryOption<T extends string> = { key: T; label: string; dot?: string };

type CategoryChipsProps<T extends string> = {
  options: CategoryOption<T>[];
  selected: T;
  onSelect: (key: T) => void;
};

export function CategoryChips<T extends string>({ options, selected, onSelect }: CategoryChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>
      {options.map((o) => {
        const active = o.key === selected;
        return (
          <Pressable
            key={o.key}
            onPress={() => onSelect(o.key)}
            style={[styles.category, active && styles.categoryActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            {o.dot ? <View style={[styles.dot, { backgroundColor: o.dot }]} /> : null}
            <Text style={[styles.categoryText, active && { color: '#fff' }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 8, paddingHorizontal: 16 },
  category: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.chipBg,
  },
  categoryActive: { backgroundColor: '#1D4ED8' },
  categoryText: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
