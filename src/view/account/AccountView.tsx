import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { getErrorMessage } from '@/utils/errors';
import { notifyError } from '@/utils/notify';

import { AccountHeader } from './AccountHeader';
import { AccountMenuSection } from './AccountMenuSection';
import { AccountShortcuts } from './AccountShortcuts';
import { buildMenu } from './constants';
import { GuestAccount } from './GuestAccount';
import { ProfileCard } from './ProfileCard';

export function AccountView() {
  const { user, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de vous déconnecter.'));
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <GuestAccount />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AccountHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProfileCard user={user} />
        <AccountShortcuts />
        {buildMenu(user).map((section) => (
          <AccountMenuSection key={section.key} section={section} />
        ))}

        <Pressable
          onPress={signOut}
          disabled={signingOut}
          style={({ pressed }) => [styles.signOut, (pressed || signingOut) && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityState={{ busy: signingOut }}>
          {signingOut ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <Text style={styles.signOutText}>Se déconnecter</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.footer}>Flot Boutique</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 32 },
  signOut: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  signOutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
  footer: { marginTop: 16, textAlign: 'center', fontSize: 12, color: colors.strike },
});
