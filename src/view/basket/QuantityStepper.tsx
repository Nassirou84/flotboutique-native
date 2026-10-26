import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function QuantityStepper({ value, onChange, min = 1, max = 99, disabled }: Props) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={!canDecrease}
        style={[styles.btn, !canDecrease && styles.btnOff]}
        accessibilityRole="button"
        accessibilityLabel="Diminuer la quantité">
        <Ionicons name="remove" size={18} color={colors.text} />
      </Pressable>
      <Text style={styles.value} accessibilityLabel={`Quantité ${value}`}>
        {value}
      </Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={!canIncrease}
        style={[styles.btn, !canIncrease && styles.btnOff]}
        accessibilityRole="button"
        accessibilityLabel="Augmenter la quantité">
        <Ionicons name="add" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOff: { opacity: 0.4 },
  value: { minWidth: 32, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },
});
