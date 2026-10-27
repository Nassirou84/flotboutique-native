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
import { isPasswordValid, PasswordStrength } from './PasswordStrength';
import { useLeaveWhenAuthenticated } from './use-leave-when-authenticated';

const comingSoon = (feature: string) => notifyError(`${feature} sera bientôt disponible.`, 'Bientôt disponible');

function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
      <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text} />
    </Pressable>
  );
}

export function RegisterView() {
  useLeaveWhenAuthenticated();
  const { register } = useAuth();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!lastName.trim()) {
      notifyError('Saisissez votre nom.');
      return;
    }
    if (!firstName.trim()) {
      notifyError('Saisissez votre prénom.');
      return;
    }
    if (!email.trim()) {
      notifyError('Saisissez votre adresse email.');
      return;
    }
    if (!isPasswordValid(password)) {
      notifyError('Le mot de passe doit contenir au moins 8 caractères et 1 chiffre.');
      return;
    }
    if (password !== confirm) {
      notifyError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!accepted) {
      notifyError('Acceptez les Conditions Générales de Vente et la Politique de Confidentialité pour continuer.');
      return;
    }
    setSubmitting(true);
    try {
      await register(email.trim(), password, firstName.trim(), lastName.trim());
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de créer le compte.'), 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      variant="plain"
      title="Créer votre compte client"
      subtitle="Bénéficiez de livraisons express à Abidjan, du suivi coursier en temps réel et de la garantie exclusive Flot Care.">
      <View style={styles.form}>
        <AuthField
          variant="plain"
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
          placeholder="ex: Koffi"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          returnKeyType="next"
          left={<Ionicons name="person" size={18} color={colors.textMuted} />}
        />
        <AuthField
          variant="plain"
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="ex: Ange"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          left={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
        />
        <AuthField
          variant="plain"
          label="Adresse email"
          value={email}
          onChangeText={setEmail}
          placeholder="ange.koffi@domaine.ci"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          left={<Ionicons name="mail-outline" size={20} color={colors.text} />}
        />
        <AuthField
          variant="plain"
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          left={<Ionicons name="lock-closed" size={18} color={colors.textMuted} />}
          right={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
        />
        <PasswordStrength password={password} />
        <AuthField
          variant="plain"
          label="Confirmer le mot de passe"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry={!showConfirm}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
          left={<Ionicons name="refresh-circle-outline" size={20} color={colors.text} />}
          right={<PasswordToggle visible={showConfirm} onToggle={() => setShowConfirm((s) => !s)} />}
        />

        <Pressable
          onPress={() => setAccepted((a) => !a)}
          style={styles.consent}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}>
          <Ionicons
            name={accepted ? 'checkbox' : 'square-outline'}
            size={22}
            color={accepted ? '#1D4ED8' : colors.textMuted}
          />
          <Text style={styles.consentText}>
            J’accepte les <Text style={styles.link}>Conditions Générales de Vente</Text> et la{' '}
            <Text style={styles.link}>Politique de Confidentialité</Text> de Flot Boutique.
          </Text>
        </Pressable>

        <AuthButton label="Créer mon compte Flot" icon="arrow-forward" iconRight loading={submitting} onPress={submit} />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OU S’INSCRIRE AVEC</Text>
        <View style={styles.line} />
      </View>

      <Pressable onPress={() => comingSoon('L’inscription avec Google')} style={styles.google} accessibilityRole="button">
        <Ionicons name="logo-google" size={18} color="#EA4335" />
        <Text style={styles.googleText}>Google</Text>
      </Pressable>

      <View style={styles.signin}>
        <Text style={styles.signinLabel}>Vous avez déjà un compte client Flot ?</Text>
        <Pressable
          onPress={() => router.replace('/connexion')}
          style={styles.signinLink}
          accessibilityRole="link">
          <Text style={styles.signinText}>Se connecter directement</Text>
          <Ionicons name="arrow-forward" size={15} color="#1D4ED8" />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerHead}>
          <Ionicons name="shield-checkmark-outline" size={15} color={colors.textMuted} />
          <Text style={styles.footerTitle}>GARANTIE & SÉCURITÉ FLOT CARE</Text>
        </View>
        <Text style={styles.footerText}>
          Données cryptées SSL 256-bit • Retours sous 10 jours • Support client basé à Cocody, Abidjan.
        </Text>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 4 },
  consentText: { flex: 1, fontSize: 14.5, lineHeight: 22, color: colors.text },
  link: { color: '#1D4ED8', textDecorationLine: 'underline' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerText: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.5, color: colors.textMuted },
  google: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  googleText: { fontSize: 15, fontWeight: '700', color: colors.text },
  signin: { alignItems: 'center', gap: 6, padding: 16, borderRadius: 12, backgroundColor: '#E2EBFF' },
  signinLabel: { fontSize: 14.5, color: colors.text },
  signinLink: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  signinText: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
  footer: { alignItems: 'center', gap: 6 },
  footerHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3, color: colors.textMuted },
  footerText: { fontSize: 13.5, lineHeight: 20, textAlign: 'center', color: colors.text },
});
