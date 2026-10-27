import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updatePassword } from '@/api/user/update-password';
import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';
import { AuthButton } from '@/view/auth/AuthButton';
import { AuthField } from '@/view/auth/AuthField';
import { isPasswordValid, PasswordStrength } from '@/view/auth/PasswordStrength';

export function EditPasswordView() {
  const { user, loading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  // One eye toggles both fields, as in the web storefront's modal.
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/compte'));

  const submit = async () => {
    if (!isPasswordValid(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères et 1 chiffre.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await updatePassword(password);
      notifySuccess('Mot de passe mis à jour avec succès');
      goBack();
    } catch (e) {
      notifyError(getErrorMessage(e, 'Échec de la mise à jour du mot de passe'), 'Modification impossible');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = (
    <Pressable
      onPress={() => setVisible((v) => !v)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
      <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Changer le mot de passe</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.subtitle}>Entrez votre nouveau mot de passe et confirmez-le.</Text>

            <AuthField
              variant="plain"
              label="Nouveau mot de passe"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (error) setError('');
              }}
              placeholder="Entrez votre nouveau mot de passe"
              secureTextEntry={!visible}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              left={<Ionicons name="lock-closed" size={18} color={colors.textMuted} />}
              right={toggle}
            />
            <PasswordStrength password={password} />
            <AuthField
              variant="plain"
              label="Confirmez le nouveau mot de passe"
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                // Like the web, flag a mismatch while typing.
                setError(v !== password ? 'Les mots de passe ne correspondent pas' : '');
              }}
              placeholder="Confirmez votre nouveau mot de passe"
              secureTextEntry={!visible}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={submit}
              error={error}
              left={<Ionicons name="refresh-circle-outline" size={20} color={colors.text} />}
              right={toggle}
            />

            <AuthButton label="Changer le mot de passe" icon="checkmark" loading={submitting} onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 16 },
  form: { gap: 16 },
  subtitle: { fontSize: 14, color: colors.textMuted },
});
