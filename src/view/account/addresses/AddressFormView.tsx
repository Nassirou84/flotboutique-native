import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import type { Address } from '@/types/user';
import { AuthButton } from '@/view/auth/AuthButton';
import { AuthField } from '@/view/auth/AuthField';

import { EMPTY_ADDRESS, validateAddress, type AddressErrors } from './constants';
import { useAddresses } from './use-addresses';

export function AddressFormView() {
  const { index: indexParam } = useLocalSearchParams<{ index?: string }>();
  const { user, loading, addresses, save } = useAddresses();

  const index = indexParam === undefined ? undefined : Number(indexParam);
  const editing = index !== undefined ? addresses[index] : undefined;

  // The first address is the default one; later ones only when asked, like the web's "primary" checkbox.
  const [form, setForm] = useState<Address>(() => ({
    ...EMPTY_ADDRESS,
    ...editing,
    suite: editing?.suite ?? '',
    country: editing?.country || EMPTY_ADDRESS.country,
    isDefault: editing ? editing.isDefault : addresses.length === 0,
  }));
  const [errors, setErrors] = useState<AddressErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Redirect href="/compte" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/adresses'));
  const set = <K extends keyof Address>(key: K, value: Address[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  // Making another address the default is how the default moves; it cannot simply be switched off.
  const lockedDefault = !!editing?.isDefault || addresses.length === 0;

  const submit = async () => {
    const found = validateAddress(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const saved = await save(
        {
          ...form,
          street: form.street.trim(),
          suite: form.suite?.trim() ?? '',
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country?.trim() ?? '',
        },
        index,
      );
      if (saved) goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.back} accessibilityRole="button" accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{editing ? "Modifier l'adresse de livraison" : 'Ajouter une nouvelle adresse'}</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.subtitle}>Entrez le lieu de livraison pour vos commandes.</Text>

            <AuthField
              variant="plain"
              label="Rue"
              value={form.street}
              onChangeText={(v) => set('street', v)}
              placeholder="ex: Rue des Jardins, Cocody"
              autoCapitalize="words"
              autoComplete="street-address"
              textContentType="streetAddressLine1"
              returnKeyType="next"
              error={errors.street}
              left={<Ionicons name="location-outline" size={18} color={colors.textMuted} />}
            />
            <AuthField
              variant="plain"
              label="Appartement, suite, unité (facultatif)"
              value={form.suite}
              onChangeText={(v) => set('suite', v)}
              placeholder="ex: Appartement 2B"
              autoCapitalize="words"
              textContentType="streetAddressLine2"
              returnKeyType="next"
              left={<Ionicons name="business-outline" size={18} color={colors.textMuted} />}
            />
            <AuthField
              variant="plain"
              label="Commune"
              value={form.city}
              onChangeText={(v) => set('city', v)}
              placeholder="ex: Cocody"
              autoCapitalize="words"
              textContentType="addressCity"
              returnKeyType="next"
              error={errors.city}
              left={<Ionicons name="map-outline" size={18} color={colors.textMuted} />}
            />
            <AuthField
              variant="plain"
              label="Ville"
              value={form.state}
              onChangeText={(v) => set('state', v)}
              placeholder="ex: Abidjan"
              autoCapitalize="words"
              textContentType="addressState"
              returnKeyType="next"
              error={errors.state}
              left={<Ionicons name="navigate-outline" size={18} color={colors.textMuted} />}
            />
            <AuthField
              variant="plain"
              label="Pays"
              value={form.country}
              onChangeText={(v) => set('country', v)}
              placeholder="ex: Côte d'Ivoire"
              autoCapitalize="words"
              textContentType="countryName"
              returnKeyType="done"
              onSubmitEditing={submit}
              left={<Ionicons name="flag-outline" size={18} color={colors.textMuted} />}
            />

            <View style={styles.defaultRow}>
              <View style={styles.defaultText}>
                <Text style={styles.defaultLabel}>Définir comme adresse de livraison par défaut</Text>
                {lockedDefault && editing?.isDefault ? (
                  <Text style={styles.hint}>Pour changer d’adresse par défaut, définissez-en une autre.</Text>
                ) : null}
              </View>
              <Switch
                value={form.isDefault}
                onValueChange={(v) => set('isDefault', v)}
                disabled={lockedDefault}
                trackColor={{ true: colors.primary }}
              />
            </View>

            <AuthButton
              label={editing ? 'Enregistrer' : "Ajouter l'adresse"}
              icon="checkmark"
              loading={submitting}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 16 },
  form: { gap: 16 },
  subtitle: { fontSize: 14, color: colors.textMuted },
  defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  defaultText: { flex: 1, gap: 2 },
  defaultLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  hint: { fontSize: 12, color: colors.textMuted },
});
