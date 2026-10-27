import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { TrustedDevice } from '@/types/user';

const PLATFORM_NAMES: Record<string, string> = { ios: 'iOS', android: 'Android' };

/** This app sends `FlotBoutique/<os> <version>`; any other value is a browser user agent, shown as is. */
const deviceName = (userAgent: string) => {
  const app = /^FlotBoutique\/(\w+) (.+)$/.exec(userAgent);
  return app ? `Application Flot Boutique • ${PLATFORM_NAMES[app[1]] ?? app[1]} ${app[2]}` : userAgent;
};

const deviceIcon = (platform: string) =>
  platform === 'ios' || platform === 'android' ? 'phone-portrait-outline' : 'desktop-outline';

type Props = { device: TrustedDevice; current: boolean; busy: boolean; onRemove: () => void };

export function TrustedDeviceCard({ device, current, busy, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name={deviceIcon(device.platform)} size={22} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {deviceName(device.userAgent)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {[device.platform, device.language, device.timeZone].filter(Boolean).join(' • ')}
        </Text>
      </View>

      {current ? (
        <View style={styles.current}>
          <Ionicons name="checkmark-circle" size={12} color={colors.green} />
          <Text style={styles.currentText}>Appareil actuel</Text>
        </View>
      ) : (
        <Pressable
          onPress={onRemove}
          disabled={busy}
          hitSlop={8}
          style={busy && { opacity: 0.4 }}
          accessibilityRole="button"
          accessibilityLabel="Supprimer l'appareil">
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: '600', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.greenSoft,
  },
  currentText: { fontSize: 11, fontWeight: '700', color: colors.green },
});
