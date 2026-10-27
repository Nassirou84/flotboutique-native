import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { formatRelativeTime } from '@/utils/format';

import { KIND_TONES, type AppNotification } from './constants';

type Props = { notification: AppNotification; onPress: () => void };

export function NotificationCard({ notification: n, onPress }: Props) {
  const tone = KIND_TONES[n.kind];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, n.unread && styles.cardUnread, pressed && { opacity: 0.9 }]}
      accessibilityRole="button"
      accessibilityLabel={`${n.unread ? 'Non lue. ' : ''}${n.title}`}
    >
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: tone.background }]}>
          <Ionicons name={n.icon} size={24} color={tone.color} />
          {n.unread ? <View style={styles.dot} /> : null}
        </View>

        <View style={styles.body}>
          <View style={styles.meta}>
            <Text style={[styles.eyebrow, { color: tone.color }]} numberOfLines={1}>
              {n.eyebrow}
            </Text>
            {n.date ? <Text style={styles.time}>{formatRelativeTime(n.date)}</Text> : null}
          </View>
          <Text style={styles.title}>{n.title}</Text>
          <Text style={styles.text}>{n.body}</Text>

          {n.chips?.length ? (
            <View style={styles.chips}>
              {n.chips.map((chip) => (
                <View key={`${chip.label}${chip.value}`} style={[styles.chip, chip.warn && styles.chipWarn]}>
                  {chip.icon ? (
                    <Ionicons name={chip.icon} size={13} color={chip.warn ? colors.orange : colors.textMuted} />
                  ) : null}
                  <Text style={[styles.chipLabel, chip.warn && { color: colors.orange }]}>{chip.label}</Text>
                  {chip.value ? <Text style={styles.chipValue}>{chip.value}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {n.action ? (
        <View style={styles.actionRow}>
          <Pressable onPress={onPress} style={styles.action} accessibilityRole="button">
            <Text style={styles.actionText}>{n.action.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardUnread: { backgroundColor: '#EFF4FF' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  icon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  body: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  eyebrow: { flex: 1, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  time: { fontSize: 12, color: colors.textMuted },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 2 },
  text: { fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  chipWarn: { backgroundColor: colors.orangeSoft },
  chipLabel: { fontSize: 12, color: colors.textMuted },
  chipValue: { fontSize: 12.5, fontWeight: '800', letterSpacing: 0.5, color: colors.primary },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  actionText: { fontSize: 13.5, fontWeight: '700', color: colors.primary },
});
