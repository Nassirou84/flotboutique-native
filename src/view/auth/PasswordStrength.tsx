import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export const MIN_PASSWORD_LENGTH = 8;

export const passwordChecks = (password: string) => ({
  length: password.length >= MIN_PASSWORD_LENGTH,
  digit: /\d/.test(password),
});

export const isPasswordValid = (password: string) => {
  const { length, digit } = passwordChecks(password);
  return length && digit;
};

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={styles.req}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'checkmark-circle-outline'}
        size={15}
        color={met ? colors.green : colors.textMuted}
      />
      <Text style={[styles.reqText, met && { color: colors.green }]}>{label}</Text>
    </View>
  );
}

/** Strength bar and the two rules a password must satisfy. */
export function PasswordStrength({ password }: { password: string }) {
  const { length, digit } = passwordChecks(password);
  // Both rules met is "good"; a long password on top of that is "strong".
  const score = Number(length) + Number(digit) + Number(length && digit && password.length >= 12);
  const status = score === 3 ? 'Fort' : score === 2 ? 'Bon' : 'À compléter';
  const fill = score === 0 ? 0 : score === 1 ? 0.33 : score === 2 ? 0.66 : 1;

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.label}>Sécurité du mot de passe :</Text>
        <Text style={[styles.status, score >= 2 && { color: colors.green }]}>{status}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fill * 100}%`, backgroundColor: score >= 2 ? colors.green : '#94A3B8' }]} />
      </View>
      <View style={styles.reqs}>
        <Requirement met={length} label={`${MIN_PASSWORD_LENGTH}+ caractères`} />
        <Requirement met={digit} label="1 chiffre minimum" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 12.5, fontWeight: '700', color: colors.text },
  status: { fontSize: 12.5, fontWeight: '700', color: colors.textMuted },
  track: { height: 5, borderRadius: 3, backgroundColor: '#DCE6FF', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  reqs: { flexDirection: 'row', gap: 16 },
  req: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reqText: { fontSize: 12.5, color: colors.textMuted },
});
