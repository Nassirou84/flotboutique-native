import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { CheckoutFooter } from './CheckoutFooter';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutInfoStep } from './CheckoutInfoStep';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';
import { CheckoutReviewStep } from './CheckoutReviewStep';
import { CheckoutStepper } from './CheckoutStepper';
import { CheckoutSuccess } from './CheckoutSuccess';
import { useCheckout } from './use-checkout';

const TITLES = { 1: 'Livraison', 2: 'Paiement', 3: 'Confirmation' } as const;

export function CheckoutView() {
  const checkout = useCheckout();
  const { step, items, confirmation } = checkout;

  if (confirmation) {
    return (
      <SafeAreaView style={styles.safe}>
        <CheckoutSuccess confirmation={confirmation} shippingOption={checkout.address.shippingOption} />
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <CheckoutHeader title="Commande" onBack={checkout.back} />
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={40} color={colors.strike} />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Pressable onPress={() => router.replace('/catalogue')} accessibilityRole="button">
            <Text style={styles.emptyLink}>Parcourir le catalogue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <CheckoutHeader title={TITLES[step]} onBack={checkout.back} />
      <CheckoutStepper current={step} onStepPress={checkout.setStep} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {step === 1 ? (
            <CheckoutInfoStep
              user={checkout.user}
              address={checkout.address}
              errors={checkout.errors}
              updateAddress={checkout.updateAddress}
            />
          ) : null}
          {step === 2 ? (
            <CheckoutPaymentStep paymentMethod={checkout.paymentMethod} setPaymentMethod={checkout.setPaymentMethod} />
          ) : null}
          {step === 3 ? (
            <CheckoutReviewStep
              items={items}
              address={checkout.address}
              paymentMethod={checkout.paymentMethod}
              promo={checkout.promo}
              promoError={checkout.promoError}
              checkingPromo={checkout.checkingPromo}
              applyPromo={checkout.applyPromo}
              removePromo={checkout.removePromo}
              totals={checkout.totals}
              setStep={checkout.setStep}
            />
          ) : null}
        </ScrollView>

        <CheckoutFooter step={step} total={checkout.totals.total} loading={checkout.placing} onPress={checkout.next} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyLink: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
});
