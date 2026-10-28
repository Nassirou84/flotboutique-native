import { useRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputKeyPressEvent } from 'react-native';

import { colors } from '@/theme/colors';

export const PIN_LENGTH = 6;

type Props = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Six numeric boxes with auto-advance and backspace-to-previous. The PIN itself is 4 to 6 digits. */
export function DeliveryPinInput({ value, onChange, invalid, autoFocus }: Props) {
  const inputs = useRef<(TextInputInstance | null)[]>([]);
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] ?? '');

  const setDigitsFrom = (index: number, incoming: string) => {
    const next = digits.slice();
    incoming
      .replace(/\D/g, '')
      .slice(0, PIN_LENGTH - index)
      .split('')
      .forEach((d, offset) => {
        next[index + offset] = d;
      });
    onChange(next.join('').slice(0, PIN_LENGTH));
    const filled = Math.min(index + Math.max(incoming.replace(/\D/g, '').length, 0), PIN_LENGTH - 1);
    if (incoming) inputs.current[filled]?.focus();
  };

  const handleKeyPress = (index: number, e: TextInputKeyPressEvent) => {
    if (e.nativeEvent.key !== 'Backspace' || digits[index]) return;
    if (index === 0) return;
    const next = digits.slice();
    next[index - 1] = '';
    onChange(next.join(''));
    inputs.current[index - 1]?.focus();
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          style={[styles.box, digit && styles.boxFilled, invalid && styles.boxInvalid]}
          value={digit}
          onChangeText={(text) => setDigitsFrom(index, text)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          textContentType="oneTimeCode"
          autoFocus={autoFocus && index === 0}
          selectTextOnFocus
          accessibilityLabel={`Chiffre ${index + 1} du code PIN`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  box: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  boxFilled: { borderColor: colors.primary },
  boxInvalid: { borderColor: colors.danger },
});
