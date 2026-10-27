import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { CHECKOUT_STEPS, type CheckoutStep } from './constants';

type Props = { current: CheckoutStep; onStepPress: (step: CheckoutStep) => void };

export function CheckoutStepper({ current, onStepPress }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={`Étape ${current} sur 3`}>
      {CHECKOUT_STEPS.map(({ step, label }, index) => {
        const done = step < current;
        const active = step === current;
        return (
          <View key={step} style={styles.item}>
            {index > 0 ? <View style={[styles.line, step <= current && styles.lineDone]} /> : null}
            <Pressable
              onPress={() => onStepPress(step)}
              disabled={!done}
              hitSlop={6}
              style={styles.step}
              accessibilityRole="button"
              accessibilityLabel={label}>
              <View style={[styles.dot, (done || active) && styles.dotOn]}>
                {done ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={[styles.dotText, active && styles.dotTextOn]}>{step}</Text>
                )}
              </View>
              <Text style={[styles.label, (done || active) && styles.labelOn]}>{label}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
  item: { flex: 1, alignItems: 'center' },
  // The connector sits behind the dot row, reaching back to the previous step.
  line: { position: 'absolute', top: 15, right: '50%', width: '100%', height: 2, backgroundColor: colors.border },
  lineDone: { backgroundColor: '#1D4ED8' },
  step: { alignItems: 'center', gap: 6 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBg,
  },
  dotOn: { backgroundColor: '#1D4ED8' },
  dotText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  dotTextOn: { color: '#fff' },
  label: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  labelOn: { color: colors.text },
});
