import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type Props = {
  title: string;
  subtitle: string;
  /** `plain` drops the logo and badge and left-aligns the heading. */
  variant?: 'centered' | 'plain';
  children: ReactNode;
};

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

/** Shared frame of the sign-in / sign-up pages: top bar, brand header, then the page content. */
export function AuthScreen({ title, subtitle, variant = 'centered', children }: Props) {
  const plain = variant === 'plain';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.bar}>
        <Pressable onPress={goBack} hitSlop={8} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.brand}>
          <Ionicons name="bag-handle" size={16} color="#1D4ED8" />
          <Text style={styles.brandText}>FLOT</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, plain && styles.heroPlain]}>
            {plain ? null : (
              <>
                <View style={styles.logoOuter}>
                  <View style={styles.logoInner}>
                    <Ionicons name="flash" size={26} color="#fff" />
                  </View>
                  <View style={styles.logoDot} />
                </View>
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>FLOT BOUTIQUE ABIDJAN</Text>
                </View>
              </>
            )}
            <Text style={[styles.title, plain && styles.titlePlain]}>{title}</Text>
            <Text style={[styles.subtitle, plain && styles.subtitlePlain]}>{subtitle}</Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5, color: colors.text },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingTop: 8, paddingBottom: 32, gap: 20 },
  hero: { alignItems: 'center', gap: 10 },
  heroPlain: { alignItems: 'stretch', gap: 8 },
  titlePlain: { fontSize: 26, textAlign: 'left' },
  subtitlePlain: { textAlign: 'left', paddingHorizontal: 0 },
  logoOuter: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: '#DCE6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.background,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#DCE6FF',
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#3B82F6' },
  badgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3, color: '#1D4ED8' },
  title: { fontSize: 27, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 8 },
});
