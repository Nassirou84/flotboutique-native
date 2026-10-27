import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';
import { AuthButton } from '@/view/auth/AuthButton';
import { AuthField } from '@/view/auth/AuthField';

export function EditProfileView() {
  const { user, loading, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/compte'));
  const unchanged = firstName.trim() === user?.firstName && lastName.trim() === user?.lastName;

  const submit = async () => {
    if (!firstName.trim()) {
      notifyError('Saisissez votre prénom.');
      return;
    }
    if (!lastName.trim()) {
      notifyError('Saisissez votre nom.');
      return;
    }
    if (unchanged) {
      goBack();
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile(firstName.trim(), lastName.trim());
      notifySuccess('Profil mis à jour', 'Vos informations ont été enregistrées.');
      goBack();
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de mettre à jour votre profil.'), 'Modification impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Modifier mon profil</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
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
              label="Nom"
              value={lastName}
              onChangeText={setLastName}
              placeholder="ex: Koffi"
              autoCapitalize="words"
              autoComplete="family-name"
              textContentType="familyName"
              returnKeyType="done"
              onSubmitEditing={submit}
              left={<Ionicons name="person" size={18} color={colors.textMuted} />}
            />
            <Text style={styles.hint}>Votre adresse email ne peut pas être modifiée ici.</Text>
            <AuthButton label="Enregistrer" icon="checkmark" loading={submitting} onPress={submit} />
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
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 16 },
  form: { gap: 16 },
  hint: { fontSize: 12, color: colors.textMuted },
});
