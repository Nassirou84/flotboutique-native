import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { colors } from '@/theme/colors';

import { NotificationCard } from './NotificationCard';
import { NotificationFilters } from './NotificationFilters';
import { useNotifications } from './use-notifications';

export function NotificationsView() {
  const n = useNotifications();
  const { refreshing, refresh } = usePullToRefresh(n.refetch);

  const sections = n.sections.map((s) => ({ ...s, data: s.items }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
          hitSlop={8}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {n.user ? (
        <View style={styles.metaBar}>
          <View style={styles.metaLeft}>
            {n.unreadCount > 0 ? <View style={styles.pulse} /> : null}
            <Text style={[styles.metaText, n.unreadCount > 0 && styles.metaTextUnread]}>
              {n.unreadCount > 0 ? `${n.unreadCount} non lue${n.unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
            </Text>
          </View>
          <Pressable
            onPress={n.markAllRead}
            disabled={n.unreadCount === 0}
            style={[styles.markAll, n.unreadCount === 0 && { opacity: 0.5 }]}
            accessibilityRole="button"
          >
            <Ionicons name={n.unreadCount === 0 ? 'checkmark' : 'checkmark-done'} size={18} color={colors.primary} />
            <Text style={styles.markAllText}>{n.unreadCount === 0 ? 'Toutes lues' : 'Tout marquer comme lu'}</Text>
          </Pressable>
        </View>
      ) : null}

      <NotificationFilters active={n.filter} onChange={n.setFilter} unreadBy={n.unreadBy} />

      {n.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <SectionList
          sections={sections}
          style={styles.list}
          contentContainerStyle={styles.content}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.some((i) => i.unread) ? (
                <Text style={styles.sectionHint}>
                  {section.items.filter((i) => i.unread).length} nouvelle
                  {section.items.filter((i) => i.unread).length > 1 ? 's' : ''}
                </Text>
              ) : null}
            </View>
          )}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => {
                n.markRead(item.id);
                item.action?.onPress();
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="notifications-outline" size={36} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Aucune notification</Text>
              <Text style={styles.emptyText}>Le suivi de vos commandes et les offres en cours apparaîtront ici.</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              {n.user ? null : (
                <Pressable
                  onPress={() => router.navigate('/connexion')}
                  style={styles.signIn}
                  accessibilityRole="button"
                >
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.signInText}>Connectez-vous pour suivre vos commandes</Text>
                </Pressable>
              )}
              <View style={styles.trust}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
                <Text style={styles.trustText}>Centre d’alertes sécurisé Flot Boutique</Text>
              </View>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  metaText: { fontSize: 14, color: colors.textMuted },
  metaTextUnread: { fontWeight: '700', color: colors.primary },
  markAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  markAllText: { fontSize: 12.5, fontWeight: '600', color: colors.primary },
  list: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 },
  loading: { marginTop: 48 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', color: colors.text },
  sectionHint: { fontSize: 12, color: colors.textMuted },
  separator: { height: 8 },
  empty: { alignItems: 'center', gap: 8, padding: 32, paddingTop: 48 },
  emptyIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { textAlign: 'center', color: colors.textMuted },
  footer: { gap: 16, paddingTop: 24 },
  signIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  signInText: { flexShrink: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  trustText: { fontSize: 12.5, color: colors.textMuted },
});
