import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';
import { AuthField } from '@/view/auth';

import { CheckoutCard } from './CheckoutCard';
import { SHIPPING_OPTIONS } from './constants';
import { SelectableRow } from './SelectableRow';
import type { CheckoutState } from './use-checkout';

type Props = Pick<CheckoutState, 'user' | 'address' | 'errors' | 'updateAddress'>;

export function CheckoutInfoStep({ user, address, errors, updateAddress }: Props) {
  const { format } = useCurrency();
  const savedAddresses = user?.addresses ?? [];

  return (
    <View style={styles.stack}>
      <CheckoutCard title="Coordonnées" subtitle="Pour vous joindre au sujet de votre livraison.">
        <AuthField
          variant="plain"
          label="Nom complet"
          value={address.fullName}
          onChangeText={(v) => updateAddress('fullName', v)}
          placeholder="ex: Ange Koffi"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          error={errors.fullName}
          left={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
        />
        <AuthField
          variant="plain"
          label="Adresse email"
          value={address.email}
          onChangeText={(v) => updateAddress('email', v)}
          placeholder="ange.koffi@domaine.ci"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          error={errors.email}
          left={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
        />
        <AuthField
          variant="plain"
          label="Téléphone"
          value={address.phone}
          onChangeText={(v) => updateAddress('phone', v)}
          placeholder="+225 07 00 00 00 00"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
          error={errors.phone}
          left={<Ionicons name="call-outline" size={18} color={colors.textMuted} />}
        />
      </CheckoutCard>

      <CheckoutCard title="Adresse de livraison">
        {savedAddresses.length > 0 ? (
          <View style={styles.saved}>
            {savedAddresses.map((saved, index) => {
              const selected =
                saved.street === address.street &&
                (saved.suite ?? '') === (address.suite ?? '') &&
                saved.city === address.city &&
                saved.state === address.state;
              return (
                <Pressable
                  key={`${saved.street}-${index}`}
                  onPress={() => {
                    updateAddress('street', saved.street);
                    updateAddress('suite', saved.suite ?? '');
                    updateAddress('city', saved.city);
                    updateAddress('state', saved.state);
                  }}
                  style={[styles.savedCard, selected && styles.savedCardOn]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}>
                  <Ionicons name="location-outline" size={18} color={selected ? '#1D4ED8' : colors.textMuted} />
                  <Text style={styles.savedText} numberOfLines={2}>
                    {saved.street}
                    {saved.suite ? `, ${saved.suite}` : ''}
                    {'\n'}
                    {saved.city}, {saved.state}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
        <AuthField
          variant="plain"
          label="Adresse"
          value={address.street}
          onChangeText={(v) => updateAddress('street', v)}
          placeholder="ex: Rue des Jardins, Cocody"
          autoCapitalize="sentences"
          autoComplete="street-address"
          textContentType="streetAddressLine1"
          returnKeyType="next"
          error={errors.street}
          left={<Ionicons name="home-outline" size={18} color={colors.textMuted} />}
        />
        <AuthField
          variant="plain"
          label="Complément (facultatif)"
          value={address.suite ?? ''}
          onChangeText={(v) => updateAddress('suite', v)}
          placeholder="ex: Résidence, bâtiment, appartement"
          autoCapitalize="sentences"
          textContentType="streetAddressLine2"
          returnKeyType="next"
        />
        <View style={styles.pair}>
          <View style={styles.half}>
            <AuthField
              variant="plain"
              label="Ville"
              value={address.city}
              onChangeText={(v) => updateAddress('city', v)}
              placeholder="ex: Abidjan"
              autoCapitalize="words"
              textContentType="addressCity"
              returnKeyType="next"
              error={errors.city}
            />
          </View>
          <View style={styles.half}>
            <AuthField
              variant="plain"
              label="Commune"
              value={address.state}
              onChangeText={(v) => updateAddress('state', v)}
              placeholder="ex: Cocody"
              autoCapitalize="words"
              textContentType="addressState"
              returnKeyType="done"
              error={errors.state}
            />
          </View>
        </View>
      </CheckoutCard>

      <CheckoutCard title="Mode de livraison">
        <View style={styles.options}>
          {SHIPPING_OPTIONS.map((option) => (
            <SelectableRow
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.delay}
              selected={address.shippingOption === option.id}
              onPress={() => updateAddress('shippingOption', option.id)}
              trailing={
                <Text style={[styles.price, option.price === 0 && styles.free]}>
                  {option.price === 0 ? 'Gratuit' : `${format(option.price)}`}
                </Text>
              }
            />
          ))}
        </View>
      </CheckoutCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  saved: { gap: 8 },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedCardOn: { borderColor: '#1D4ED8', backgroundColor: '#F4F7FF' },
  savedText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.text },
  pair: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  options: { gap: 10 },
  price: { fontSize: 13, fontWeight: '800', color: colors.text },
  free: { color: colors.green },
});
