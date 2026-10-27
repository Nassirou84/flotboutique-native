import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-provider';
import { getFingerprint, type FingerprintComponents } from '@/auth/device';
import { colors } from '@/theme/colors';
import type { TrustedDevice } from '@/types/user';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

import { TrustedDeviceCard } from './TrustedDeviceCard';

export function TrustedDevicesView() {
  const { user, loading, removeTrustedDevice } = useAuth();
  const [fingerprint, setFingerprint] = useState<FingerprintComponents | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    getFingerprint().then(setFingerprint);
  }, []);

  if (!loading && !user) return <Redirect href="/compte" />;

  const devices = user?.trustedDevices ?? [];

  const remove = (device: TrustedDevice) =>
    Alert.alert(
      "Supprimer l'appareil",
      `Cette action est irréversible. Cela supprimera définitivement ${device.userAgent} de nos serveurs.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setRemovingId(device.id);
            try {
              await removeTrustedDevice(device.id);
              notifySuccess('Appareil de confiance supprimé avec succès');
            } catch (error) {
              notifyError(getErrorMessage(error, "Échec de la suppression de l'appareil de confiance"));
            } finally {
              setRemovingId(null);
            }
          },
        },
      ],
    );

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
        <Text style={styles.title}>Appareils de confiance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Ces appareils ont déjà validé un code de double authentification : ils n’en demandent plus à la connexion.
          Supprimez un appareil que vous ne reconnaissez pas ou que vous n’utilisez plus.
        </Text>

        {devices.map((device) => (
          <TrustedDeviceCard
            key={device.id}
            device={device}
            current={!!fingerprint && fingerprint.userAgent === device.userAgent}
            busy={removingId === device.id}
            onRemove={() => remove(device)}
          />
        ))}

        {devices.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="shield-checkmark-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Aucun appareil de confiance</Text>
            <Text style={styles.emptyText}>
              Activez la double authentification : l’appareil sur lequel vous validez un code apparaîtra ici.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  content: { gap: 12, padding: 16, paddingBottom: 32, flexGrow: 1 },
  description: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  empty: { alignItems: 'center', gap: 8, padding: 32, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyText: { textAlign: 'center', color: colors.textMuted },
});
