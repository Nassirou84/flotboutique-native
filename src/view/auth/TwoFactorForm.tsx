import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { AuthScreen } from './AuthScreen';

type Props = { email: string; onCancel: () => void };

/** Second sign-in step for accounts with two-factor authentication. */
export function TwoFactorForm({ email, onCancel }: Props) {
  const { confirm2FA, resend2FACode } = useAuth();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!code.trim()) {
      notifyError('Saisissez le code de vérification.');
      return;
    }
    setSubmitting(true);
    try {
      await confirm2FA(code.trim(), email);
    } catch (error) {
      notifyError(getErrorMessage(error, 'Code de vérification invalide.'), 'Vérification impossible');
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      await resend2FACode(email);
      notifySuccess('Code renvoyé', `Un nouveau code a été envoyé à ${email}.`);
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de renvoyer le code.'));
    }
  };

  return (
    <AuthScreen title="Vérification en deux étapes" subtitle={`Saisissez le code de vérification envoyé pour ${email}.`}>
      <View style={styles.card}>
        <AuthField
          label="Code de vérification"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          returnKeyType="go"
          onSubmitEditing={submit}
          right={<Ionicons name="shield-checkmark-outline" size={20} color={colors.textMuted} />}
        />
        <AuthButton label="Vérifier" icon="lock-closed" loading={submitting} onPress={submit} />
      </View>
      <View style={styles.links}>
        <Pressable onPress={resend} accessibilityRole="button">
          <Text style={styles.link}>Renvoyer le code</Text>
        </Pressable>
        <Pressable onPress={onCancel} accessibilityRole="button">
          <Text style={styles.muted}>Changer d’adresse email</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 16 },
  links: { alignItems: 'center', gap: 14 },
  link: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
  muted: { fontSize: 14.5, color: colors.textMuted },
});
