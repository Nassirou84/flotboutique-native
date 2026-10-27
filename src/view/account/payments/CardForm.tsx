import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { PaymentMethod } from '@/types/payment-method';
import { AuthButton } from '@/view/auth/AuthButton';
import { AuthField } from '@/view/auth/AuthField';

import { formatCardNumber, formatExpiry, validateCard, type CardErrors } from './constants';

type Values = { cardHolderName: string; cardNumber: string; expiry: string; cvv: string; isDefault: boolean };

type Props = {
  /** When set, only the name and expiry can change, as the API allows. */
  editing?: PaymentMethod;
  submitting: boolean;
  onSubmit: (values: Values) => void;
};

export function CardForm({ editing, submitting, onSubmit }: Props) {
  const [form, setForm] = useState<Values>({
    cardHolderName: editing?.cardHolderName ?? '',
    cardNumber: '',
    expiry: editing?.expiry ?? '',
    cvv: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<CardErrors>({});

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    const found = validateCard(
      form,
      editing ? ['cardHolderName', 'expiry'] : ['cardHolderName', 'cardNumber', 'expiry', 'cvv'],
    );
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(form);
  };

  return (
    <View style={styles.form}>
      {editing ? (
        <View style={styles.summary}>
          <Ionicons name="card-outline" size={18} color={colors.primary} />
          <Text style={styles.summaryText}>Carte se terminant par {editing.lastFourDigits}</Text>
        </View>
      ) : null}

      <AuthField
        variant="plain"
        label="Nom du titulaire"
        value={form.cardHolderName}
        onChangeText={(v) => set('cardHolderName', v)}
        placeholder="ex: Ange Koffi"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        error={errors.cardHolderName}
        left={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
      />

      {editing ? null : (
        <AuthField
          variant="plain"
          label="Numéro de carte"
          value={form.cardNumber}
          onChangeText={(v) => set('cardNumber', formatCardNumber(v))}
          placeholder="0000 0000 0000 0000"
          keyboardType="number-pad"
          autoComplete="cc-number"
          textContentType="creditCardNumber"
          error={errors.cardNumber}
          left={<Ionicons name="card-outline" size={18} color={colors.textMuted} />}
        />
      )}

      <View style={styles.row}>
        <View style={styles.half}>
          <AuthField
            variant="plain"
            label="Expiration (MM/AA)"
            value={form.expiry}
            onChangeText={(v) => set('expiry', formatExpiry(v))}
            placeholder="MM/AA"
            keyboardType="number-pad"
            autoComplete="cc-exp"
            error={errors.expiry}
          />
        </View>
        {editing ? null : (
          <View style={styles.half}>
            <AuthField
              variant="plain"
              label="CVV"
              value={form.cvv}
              onChangeText={(v) => set('cvv', v.replace(/\D/g, '').slice(0, 3))}
              placeholder="•••"
              keyboardType="number-pad"
              secureTextEntry
              autoComplete="cc-csc"
              textContentType="creditCardSecurityCode"
              error={errors.cvv}
            />
          </View>
        )}
      </View>

      {editing ? null : (
        <View style={styles.defaultRow}>
          <Text style={styles.defaultLabel}>Définir comme moyen de paiement par défaut</Text>
          <Switch value={form.isDefault} onValueChange={(v) => set('isDefault', v)} trackColor={{ true: colors.primary }} />
        </View>
      )}

      <AuthButton
        label={editing ? 'Enregistrer' : 'Enregistrer la carte'}
        icon="checkmark"
        loading={submitting}
        onPress={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, backgroundColor: colors.primarySoft },
  summaryText: { fontSize: 14, fontWeight: '600', color: colors.text },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  defaultLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
});
