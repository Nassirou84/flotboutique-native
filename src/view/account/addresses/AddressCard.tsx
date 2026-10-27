import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { Address } from '@/types/user';

type Props = {
  address: Address;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault: () => void;
};

export function AddressCard({ address, onEdit, onRemove, onSetDefault }: Props) {
  return (
    <View style={[styles.card, address.isDefault && styles.cardDefault]}>
      <View style={styles.body}>
        {address.isDefault ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Par défaut</Text>
          </View>
        ) : (
          <Pressable onPress={onSetDefault} hitSlop={8} accessibilityRole="button">
            <Text style={styles.setDefault}>Définir par défaut</Text>
          </Pressable>
        )}
        <Text style={styles.text}>
          {address.street}
          {address.suite ? `, ${address.suite}` : ''}
          {'\n'}
          {address.city}, {address.state}
          {address.country ? `\n${address.country}` : ''}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button" accessibilityLabel="Modifier l'adresse">
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </Pressable>
        <Pressable onPress={onRemove} hitSlop={8} accessibilityRole="button" accessibilityLabel="Supprimer l'adresse">
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDefault: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  body: { flex: 1, gap: 6 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.primary },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  setDefault: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  text: { fontSize: 14, lineHeight: 20, color: colors.text },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
