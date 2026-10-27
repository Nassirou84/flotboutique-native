import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import type { MobileProvider } from '@/api/payment-method/payment-methods';
import { colors } from '@/theme/colors';
import { AuthButton } from '@/view/auth/AuthButton';
import { AuthField } from '@/view/auth/AuthField';

import { formatMobileNumber, MOBILE_COUNTRY_CODE, providerLabel } from './constants';

type Props = {
  provider: MobileProvider;
  submitting: boolean;
  onSubmit: (values: { mobilePaymentNumber: string; isDefault: boolean }) => void;
};

export function MobileMoneyForm({ provider, submitting, onSubmit }: Props) {
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    const digits = phone.replace(/\D/g, '');
    // The API requires +225 followed by exactly 10 digits.
    if (digits.length !== 10) {
      setError('Saisissez un numéro mobile valide à 10 chiffres.');
      return;
    }
    setError('');
    onSubmit({ mobilePaymentNumber: `${MOBILE_COUNTRY_CODE}${digits}`, isDefault });
  };

  return (
    <View style={styles.form}>
      <AuthField
        variant="plain"
        label={`Numéro ${provider === 'wave' ? 'Wave' : 'Orange Money'}`}
        value={phone}
        onChangeText={(v) => {
          setPhone(formatMobileNumber(v));
          if (error) setError('');
        }}
        placeholder="07 00 00 00 00"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="done"
        onSubmitEditing={submit}
        error={error}
        left={<Text style={styles.prefix}>{MOBILE_COUNTRY_CODE}</Text>}
      />

      <View style={styles.defaultRow}>
        <Text style={styles.defaultLabel}>Définir comme moyen de paiement par défaut</Text>
        <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: colors.primary }} />
      </View>

      <AuthButton label={`Enregistrer ${providerLabel(provider)}`} icon="checkmark" loading={submitting} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  prefix: { fontSize: 15, fontWeight: '600', color: colors.text },
  defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  defaultLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
});
