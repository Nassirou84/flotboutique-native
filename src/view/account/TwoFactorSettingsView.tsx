import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import type { IconName } from '@/view/orders/constants';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

const STEPS: { icon: IconName; text: string }[] = [
  { icon: 'phone-portrait-outline', text: 'Vous vous connectez depuis un nouvel appareil ou une nouvelle session.' },
  { icon: 'mail-outline', text: 'Nous vous envoyons un code à usage unique par votre méthode de contact.' },
  { icon: 'keypad-outline', text: 'Vous saisissez ce code pour terminer la connexion.' },
  { icon: 'shield-checkmark-outline', text: 'L’appareil est ensuite reconnu comme appareil de confiance : plus de code à chaque fois.' },
];

export function TwoFactorSettingsView() {
  const { user, loading, updateTwoFactor } = useAuth();
  // Shows the requested state right away while the server answers, then falls back to what it stored.
  const [pending, setPending] = useState<boolean | null>(null);

  if (!loading && !user) return <Redirect href="/compte" />;

  const enabled = pending ?? !!user?.twoFactor;
  const method = user?.twoFactorContactMethod === 'text' ? 'SMS' : 'e-mail';

  const toggle = async (value: boolean) => {
    setPending(value);
    try {
      await updateTwoFactor(value);
      notifySuccess("L'authentification à deux facteurs a été mise à jour avec succès.");
    } catch (error) {
      notifyError(
        getErrorMessage(error, "Une erreur s'est produite lors de la mise à jour de l'authentification à deux facteurs."),
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/compte'))}
          hitSlop={8}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Double authentification</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.icon}>
              <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            </View>
            <View style={styles.toggleText}>
              <Text style={styles.cardTitle}>Authentification à deux facteurs (2FA)</Text>
              <Text style={[styles.status, enabled && styles.statusOn]}>{enabled ? 'Activée' : 'Désactivée'}</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={toggle}
              disabled={pending !== null}
              trackColor={{ true: colors.primary }}
              accessibilityLabel="Authentification à deux facteurs"
            />
          </View>

          <Text style={styles.description}>
            Recevez des codes à usage unique via votre méthode de contact préférée pour un nouvel appareil ou une nouvelle
            session. Même si quelqu’un connaît votre mot de passe, il ne pourra pas accéder à votre compte sans ce code.
          </Text>

          {enabled ? (
            <View style={styles.method}>
              <Ionicons name={user?.twoFactorContactMethod === 'text' ? 'chatbubble-outline' : 'mail-outline'} size={16} color={colors.primary} />
              <Text style={styles.methodText}>Les codes sont envoyés par {method}.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comment ça marche ?</Text>
          {STEPS.map((step, index) => (
            <View key={step.text} style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.stepText}>
                <Text style={styles.stepNumber}>{index + 1}. </Text>
                {step.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  content: { gap: 12, padding: 16, paddingBottom: 32 },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  status: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  statusOn: { color: colors.green },
  description: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  methodText: { flex: 1, fontSize: 13, fontWeight: '500', color: colors.primary },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.text },
  stepNumber: { fontWeight: '700', color: colors.primary },
});
