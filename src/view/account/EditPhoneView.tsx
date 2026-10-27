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

// International format: optional "+", then 8 to 15 digits (spaces, dots, dashes and brackets are allowed).
const isPhoneValid = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 8 && digits.length <= 15;
};

export function EditPhoneView() {
  const { user, loading, updatePhone } = useAuth();

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/compte'));

  const submit = async () => {
    const value = phone.trim();
    if (!isPhoneValid(value)) {
      setError('Saisissez un numéro valide, par exemple +225 07 00 00 00 00.');
      return;
    }
    setError('');
    if (value === user?.phone) {
      goBack();
      return;
    }
    setSubmitting(true);
    try {
      await updatePhone(value);
      notifySuccess('Numéro mis à jour', 'Votre numéro de téléphone a été enregistré.');
      goBack();
    } catch (e) {
      notifyError(getErrorMessage(e, 'Impossible de mettre à jour votre numéro.'), 'Modification impossible');
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
        <Text style={styles.title}>Numéro de téléphone</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <AuthField
              variant="plain"
              label="Numéro de téléphone"
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                if (error) setError('');
              }}
              placeholder="+225 07 00 00 00 00"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              returnKeyType="done"
              onSubmitEditing={submit}
              error={error}
              left={<Ionicons name="call-outline" size={18} color={colors.textMuted} />}
            />
            <Text style={styles.hint}>Il servira à vous joindre pour la livraison de vos commandes.</Text>
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
