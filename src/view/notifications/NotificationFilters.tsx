import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { FILTERS, type NotificationFilter } from './constants';

type Props = {
  active: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  /** Unread count shown on each chip when above zero. */
  unreadBy: (filter: NotificationFilter) => number;
};

export function NotificationFilters({ active, onChange, unreadBy }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {FILTERS.map((f) => {
        const selected = f.key === active;
        const count = unreadBy(f.key);
        return (
          <Pressable
            key={f.key}
            onPress={() => onChange(f.key)}
            style={[styles.chip, selected && styles.chipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{f.label}</Text>
            {count > 0 ? (
              <View style={[styles.count, selected && styles.countActive]}>
                <Text style={[styles.countText, selected && styles.countTextActive]}>{count}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // A horizontal ScrollView shrinks by default and would be squeezed away by a long list below it.
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  chipActive: { backgroundColor: colors.primary },
  label: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  labelActive: { color: '#fff' },
  count: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  countActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  countText: { fontSize: 11, fontWeight: '700', textAlign: 'center', color: colors.primary },
  countTextActive: { color: '#fff' },
});
