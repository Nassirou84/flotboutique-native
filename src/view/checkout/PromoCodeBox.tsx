import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

import type { CheckoutState } from './use-checkout';

type Props = Pick<CheckoutState, 'promo' | 'promoError' | 'checkingPromo' | 'applyPromo' | 'removePromo'>;

export function PromoCodeBox({ promo, promoError, checkingPromo, applyPromo, removePromo }: Props) {
  const { format } = useCurrency();
  const [code, setCode] = useState('');

  if (promo) {
    return (
      <View style={styles.applied}>
        <Ionicons name="pricetag" size={18} color={colors.green} />
        <Text style={styles.appliedText}>
          Code <Text style={styles.bold}>{promo.code}</Text> appliqué (− {format(promo.discount)})
        </Text>
        <Pressable onPress={removePromo} hitSlop={8} accessibilityRole="button" accessibilityLabel="Retirer le code promo">
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <TextInput
          value={code}
          onChangeText={(v) => setCode(v.toUpperCase())}
          placeholder="CODE PROMO"
          placeholderTextColor={colors.strike}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => applyPromo(code)}
          style={styles.input}
          accessibilityLabel="Code promo"
        />
        <Pressable
          onPress={() => applyPromo(code)}
          disabled={checkingPromo || !code.trim()}
          style={[styles.apply, (checkingPromo || !code.trim()) && styles.applyDisabled]}
          accessibilityRole="button">
          {checkingPromo ? <ActivityIndicator color="#fff" /> : <Text style={styles.applyText}>Appliquer</Text>}
        </Pressable>
      </View>
      {promoError ? <Text style={styles.error}>{promoError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 15,
    letterSpacing: 1,
    color: colors.text,
    backgroundColor: '#EDF1FF',
  },
  apply: {
    minWidth: 96,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
  },
  applyDisabled: { opacity: 0.5 },
  applyText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  error: { fontSize: 12.5, color: colors.danger },
  applied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.greenSoft,
  },
  appliedText: { flex: 1, fontSize: 13.5, color: colors.text },
  bold: { fontWeight: '800' },
});
