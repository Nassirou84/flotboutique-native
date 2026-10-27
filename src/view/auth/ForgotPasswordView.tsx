import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { requestPasswordReset } from '@/api/user/forgot-password';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { AuthScreen } from './AuthScreen';

const backToLogin = () => (router.canGoBack() ? router.back() : router.replace('/connexion'));

export function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      notifyError('Saisissez votre adresse email.');
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset(trimmed);
      if (sentTo) notifySuccess('Lien renvoyé', `Un nouvel email a été envoyé à ${trimmed}.`);
      setSentTo(trimmed);
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible d’envoyer le lien de réinitialisation.'), 'Envoi impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title="Mot de passe oublié ?"
      subtitle="Saisissez l’adresse email de votre compte, nous vous enverrons un lien pour choisir un nouveau mot de passe.">
      <View style={styles.card}>
        {sentTo ? (
          <View style={styles.sent}>
            <View style={styles.sentIcon}>
              <Ionicons name="mail-open-outline" size={28} color="#1D4ED8" />
            </View>
            <Text style={styles.sentTitle}>Vérifiez votre boîte mail</Text>
            <Text style={styles.sentText}>
              Si un compte existe pour <Text style={styles.sentEmail}>{sentTo}</Text>, vous allez recevoir un lien de
              réinitialisation. Pensez à regarder dans vos courriers indésirables.
            </Text>
            <AuthButton label="Renvoyer le lien" icon="refresh" loading={submitting} onPress={submit} />
          </View>
        ) : (
          <>
            <AuthField
              label="Adresse email"
              value={email}
              onChangeText={setEmail}
              placeholder="client@domaine.ci"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={submit}
              right={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
            />
            <AuthButton label="Envoyer le lien" icon="paper-plane" loading={submitting} onPress={submit} />
          </>
        )}
      </View>

      <Pressable onPress={backToLogin} style={styles.back} accessibilityRole="button">
        <Ionicons name="arrow-back" size={16} color={colors.text} />
        <Text style={styles.backText}>Retour à la connexion</Text>
      </Pressable>

      <View style={styles.signup}>
        <Text style={styles.signupLabel}>Pas encore de compte ?</Text>
        <Pressable onPress={() => router.replace('/inscription')} accessibilityRole="link">
          <Text style={styles.signupText}>Créer un compte client</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sent: { alignItems: 'center', gap: 12 },
  sentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCE6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  sentText: { fontSize: 14.5, lineHeight: 22, textAlign: 'center', color: colors.textMuted },
  sentEmail: { fontWeight: '700', color: colors.text },
  back: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  backText: { fontSize: 14.5, fontWeight: '500', color: colors.text },
  signup: { alignItems: 'center', gap: 6 },
  signupLabel: { fontSize: 14.5, color: colors.textMuted },
  signupText: { fontSize: 15.5, fontWeight: '800', color: '#1D4ED8' },
});
