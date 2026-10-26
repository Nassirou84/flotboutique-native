import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

/** Search field that hands the query to `onSearch` (on submit or when the filter button is pressed). */
export function HomeSearchBox({ onSearch }: { onSearch: (query?: string) => void }) {
  const [query, setQuery] = useState('');
  const submit = () => onSearch(query.trim() || undefined);

  return (
    <View style={styles.box}>
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={submit}
        placeholder="Rechercher un smartphone, Mac, écouteurs"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        returnKeyType="search"
        numberOfLines={1}
      />
      <Pressable onPress={submit} style={styles.filterBtn} accessibilityRole="button" accessibilityLabel="Filtres">
        <Ionicons name="options-outline" size={20} color="#1D4ED8" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: 14.5, color: colors.text, padding: 0 },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E1E9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
