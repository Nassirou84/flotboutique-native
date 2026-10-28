import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  /** Called when the field is pressed, to open the full-screen search. */
  onPress: () => void;
  /** Called when the filter button is pressed. */
  onOpenFilters: () => void;
};

/** Search field: pressing it opens the full-screen search, the filter button opens the filters page. */
export function HomeSearchBox({ onPress, onOpenFilters }: Props) {
  return (
    <View style={styles.box}>
      <Pressable onPress={onPress} style={styles.field} accessibilityRole="search" accessibilityLabel="Rechercher un produit">
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <Text style={styles.placeholder} numberOfLines={1}>
          Rechercher un smartphone, Mac, écouteurs
        </Text>
      </Pressable>
      <Pressable onPress={onOpenFilters} style={styles.filterBtn} accessibilityRole="button" accessibilityLabel="Filtres">
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
  field: { flex: 1, height: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  placeholder: { flex: 1, fontSize: 14.5, color: '#94A3B8' },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E1E9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
