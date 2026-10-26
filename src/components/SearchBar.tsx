import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  activeFilters?: number;
  onPressFilters?: () => void;
};

export function SearchBar({ value, onChangeText, activeFilters = 0, onPressFilters }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.input}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="iPhone, Samsung, MacBook, AirPods"
          placeholderTextColor="#94A3B8"
          style={styles.text}
          returnKeyType="search"
          numberOfLines={1}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="Effacer la recherche">
            <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={onPressFilters}
        style={styles.filterBtn}
        accessibilityRole="button"
        accessibilityLabel="Filtres">
        <Ionicons name="options" size={22} color="#fff" />
        {activeFilters > 0 && (
          <View style={styles.count}>
            <Text style={styles.countText}>{activeFilters}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  input: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  text: { flex: 1, fontSize: 15, color: colors.text, padding: 0 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C2410C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { color: '#fff', fontSize: 10.5, fontWeight: '700' },
});
