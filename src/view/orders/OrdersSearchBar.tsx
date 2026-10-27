import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { value: string; onChangeText: (value: string) => void };

export function OrdersSearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.field}>
        <Ionicons name="search-outline" size={20} color={colors.strike} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher par n° de commande"
          placeholderTextColor={colors.strike}
          autoCapitalize="none"
          returnKeyType="search"
          style={styles.input}
          accessibilityLabel="Rechercher une commande"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  field: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  input: { flex: 1, height: 40, fontSize: 14, color: colors.text },
});
