import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import type { IconName } from './constants';

type Props = {
  icon: IconName;
  title: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  /** Small text on the right (a price, a badge). */
  trailing?: ReactNode;
  onPress: () => void;
};

/** Radio-style option card: shipping options, payment methods. */
export function SelectableRow({ icon, title, description, selected, disabled, trailing, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.row, selected && styles.rowSelected, disabled && styles.rowDisabled]}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}>
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      <Ionicons name={icon} size={22} color={selected ? '#1D4ED8' : colors.textMuted} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowSelected: { borderWidth: 2, borderColor: '#1D4ED8', backgroundColor: '#F4F7FF' },
  rowDisabled: { opacity: 0.55 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.strike,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: '#1D4ED8' },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#1D4ED8' },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  description: { fontSize: 13, lineHeight: 18, color: colors.textMuted },
});
