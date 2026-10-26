import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

const MINUTE = 60_000;

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / MINUTE));
  return { d: Math.floor(total / 1440), h: Math.floor((total % 1440) / 60), m: total % 60 };
}

const pad = (n: number) => n.toString().padStart(2, '0');

export function FlashSale({ endsAt }: { endsAt: number }) {
  const [remaining, setRemaining] = useState(() => endsAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(endsAt - Date.now()), 15_000);
    return () => clearInterval(id);
  }, [endsAt]);

  const { d, h, m } = split(remaining);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Ionicons name="timer-outline" size={20} color={colors.danger} />
          <Text style={styles.title}>VENTES FLASH</Text>
        </View>
        <Text style={styles.subtitle}>Stock direct Abidjan</Text>
      </View>
      <View style={styles.timer}>
        <Unit value={pad(d)} label="J" />
        <Text style={styles.colon}>:</Text>
        <Unit value={pad(h)} label="H" />
        <Text style={styles.colon}>:</Text>
        <Unit value={pad(m)} label="M" />
      </View>
    </View>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.unitValue}>{value}</Text>
      <Text style={styles.unitLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#DCE7FD',
  },
  left: { gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: 0.4 },
  subtitle: { fontSize: 13, color: colors.textMuted },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  colon: { fontSize: 16, fontWeight: '700', color: colors.textMuted },
  unit: {
    width: 40,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  unitValue: { color: '#fff', fontSize: 17, fontWeight: '800', fontVariant: ['tabular-nums'] },
  unitLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '700' },
});
