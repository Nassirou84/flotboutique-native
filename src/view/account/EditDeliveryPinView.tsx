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

import { DeliveryPinInput } from './DeliveryPinInput';

const isPinValid = (pin: string) => /^\d{6}$/.test(pin);

export function EditDeliveryPinView() {
  const { user, loading, updateDeliveryPin } = useAuth();

  const hasPin = !!user?.deliveryPin;
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/compte'));

  const submit = async () => {
    if (!isPinValid(pin)) {
      setError('Le code doit comporter 6 chiffres.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await updateDeliveryPin(pin);
      notifySuccess('Code enregistré', 'Votre code PIN de livraison a été enregistré.');
      goBack();
    } catch (e) {
      notifyError(getErrorMessage(e, "Impossible d'enregistrer votre code PIN."), 'Enregistrement impossible');
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
        <Text style={styles.title}>Code PIN de livraison</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            </View>
            <Text style={styles.lead}>
              Définissez un code que les livreurs devront vous demander avant de vous remettre votre colis.
            </Text>
          </View>

          <View style={styles.form}>
            <DeliveryPinInput
              value={pin}
              onChange={(v) => {
                setPin(v);
                if (error) setError('');
              }}
              invalid={!!error}
              autoFocus
            />
            {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.hint}>Code à 6 chiffres</Text>}

            {hasPin ? (
              <View style={styles.note}>
                <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                <Text style={styles.noteText}>Un code est déjà défini. En saisir un nouveau le remplacera.</Text>
              </View>
            ) : null}

            <AuthButton
              label={hasPin ? 'Modifier le code' : 'Enregistrer'}
              icon="checkmark"
              loading={submitting}
              onPress={submit}
            />
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
  content: { padding: 16, gap: 24 },
  intro: { alignItems: 'center', gap: 12, paddingTop: 8 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lead: { fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: 'center' },
  form: { gap: 16 },
  hint: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  error: { fontSize: 12, color: colors.danger, textAlign: 'center' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  noteText: { fontSize: 12, color: colors.textMuted },
});
