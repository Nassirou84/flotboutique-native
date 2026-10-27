import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError } from '@/utils/notify';

import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { AuthScreen } from './AuthScreen';
import { AuthTerms } from './AuthTerms';
import { TwoFactorForm } from './TwoFactorForm';
import { useLeaveWhenAuthenticated } from './use-leave-when-authenticated';

const comingSoon = (feature: string) => notifyError(`${feature} sera bientôt disponible.`, 'Bientôt disponible');

export function LoginView() {
  useLeaveWhenAuthenticated();
  const { login, is2FaRequired } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Set once the server asked for a 2FA code, so the code step knows which account it is for.
  const [pending2FaEmail, setPending2FaEmail] = useState('');

  const submit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      notifyError('Saisissez votre adresse email et votre mot de passe.');
      return;
    }
    setSubmitting(true);
    try {
      await login(trimmed, password);
      setPending2FaEmail(trimmed);
    } catch (error) {
      notifyError(getErrorMessage(error, 'Adresse email ou mot de passe incorrect.'), 'Connexion impossible');
    } finally {
      setSubmitting(false);
    }
  };

  if (is2FaRequired && pending2FaEmail) {
    return <TwoFactorForm email={pending2FaEmail} onCancel={() => setPending2FaEmail('')} />;
  }

  return (
    <AuthScreen
      title="Bon retour parmi nous !"
      subtitle="Connectez-vous pour retrouver vos commandes et vos livraisons en cours.">
      <View style={styles.card}>
        <AuthField
          label="Adresse email"
          value={email}
          onChangeText={setEmail}
          placeholder="client@domaine.ci"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          right={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
        />
        <AuthField
          label="Mot de passe"
          labelAction={
            <Pressable onPress={() => router.navigate('/mot-de-passe-oublie')} hitSlop={8} accessibilityRole="link">
              <Text style={styles.forgot}>Mot de passe oublié ?</Text>
            </Pressable>
          }
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
          right={
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </Pressable>
          }
        />
        <AuthButton label="Se connecter" icon="lock-closed" loading={submitting} onPress={submit} />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OU CONTINUER AVEC</Text>
        <View style={styles.line} />
      </View>

      <Pressable
        onPress={() => comingSoon('La connexion avec Google')}
        style={styles.google}
        accessibilityRole="button">
        <Ionicons name="logo-google" size={18} color="#EA4335" />
        <Text style={styles.googleText}>Continuer avec Google</Text>
      </Pressable>

      <View style={styles.signup}>
        <Text style={styles.signupLabel}>Pas encore de compte ?</Text>
        <Pressable onPress={() => router.replace('/inscription')} style={styles.signupLink} accessibilityRole="link">
          <Text style={styles.signupText}>Créer un compte client</Text>
          <Ionicons name="arrow-up-outline" size={14} color="#1D4ED8" style={{ transform: [{ rotate: '45deg' }] }} />
        </Pressable>
      </View>

      <Pressable onPress={() => router.navigate('/catalogue')} style={styles.guest} accessibilityRole="button">
        <Text style={styles.guestText}>Parcourir le catalogue en mode Invité</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.text} />
      </Pressable>

      <AuthTerms action="En vous connectant" />
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
  forgot: { fontSize: 12.5, fontWeight: '700', color: '#1D4ED8' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerText: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.5, color: colors.textMuted },
  google: {
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  googleText: { fontSize: 15, fontWeight: '600', color: colors.text },
  guest: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  guestText: { fontSize: 14.5, fontWeight: '500', color: colors.text },
  signup: { alignItems: 'center', gap: 6 },
  signupLabel: { fontSize: 14.5, color: colors.textMuted },
  signupLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  signupText: { fontSize: 15.5, fontWeight: '800', color: '#1D4ED8' },
});
