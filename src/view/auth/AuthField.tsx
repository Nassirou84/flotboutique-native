import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

type Props = TextInputProps & {
  label: string;
  /** `plain` is the white, uppercase-label style used by the sign-up form; `card` sits inside a white card. */
  variant?: 'card' | 'plain';
  /** Sits at the start of the input (an icon). */
  left?: ReactNode;
  /** Sits at the end of the input (an icon or a toggle). */
  right?: ReactNode;
  /** Sits at the end of the label row (e.g. "forgot password"). */
  labelAction?: ReactNode;
  /** Validation message shown under the field; also outlines it. */
  error?: string;
};

export function AuthField({ label, variant = 'card', left, right, labelAction, error, style, ...input }: Props) {
  const plain = variant === 'plain';

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, plain && styles.labelPlain]}>{label}</Text>
        {labelAction}
      </View>
      <View style={[styles.box, plain && styles.boxPlain, !!error && styles.boxError]}>
        {left}
        <TextInput
          placeholderTextColor={colors.strike}
          autoCapitalize="none"
          style={[styles.input, style]}
          accessibilityLabel={label}
          {...input}
        />
        {right}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#EDF1FF',
  },
  labelPlain: { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', color: '#475569' },
  boxPlain: {
    height: 52,
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  boxError: { borderWidth: 1, borderColor: colors.danger },
  error: { fontSize: 12.5, color: colors.danger },
  input: { flex: 1, height: '100%', fontSize: 16, color: colors.text },
});
