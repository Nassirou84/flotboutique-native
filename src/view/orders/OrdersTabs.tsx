import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

import { ORDERS_TABS, type OrdersTabKey } from './constants';

type Props = {
  active: OrdersTabKey;
  onChange: (key: OrdersTabKey) => void;
  /** Only the totals the API provides; tabs without one show no count. */
  counts?: Partial<Record<OrdersTabKey, number>>;
};

export function OrdersTabs({ active, onChange, counts }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
      accessibilityRole="tablist">
      {ORDERS_TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, selected && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}>
            <Text style={[styles.label, selected && styles.labelActive]}>
              {tab.label}
              {counts?.[tab.key] !== undefined ? ` (${counts[tab.key]})` : ''}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // A horizontal ScrollView shrinks by default: without this, a tall orders list squeezes the tabs to nothing.
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { paddingHorizontal: 16, paddingVertical: 12, gap: 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.chipBg },
  tabActive: { backgroundColor: colors.primary },
  label: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  labelActive: { color: '#fff' },
});
