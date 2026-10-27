import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { PaymentMethodId } from '@/api/order/place-order';
import type { ShippingAddress } from '@/types/user';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type CheckoutStep = 1 | 2 | 3;

export const CHECKOUT_STEPS: { step: CheckoutStep; label: string }[] = [
  { step: 1, label: 'Livraison' },
  { step: 2, label: 'Paiement' },
  { step: 3, label: 'Confirmation' },
];

/** Mirrors the API's `EXPRESS_SHIPPING_COST`; the API recomputes the real total on its side. */
export const EXPRESS_SHIPPING_COST = 10_000;

export const SHIPPING_OPTIONS: {
  id: ShippingAddress['shippingOption'];
  title: string;
  delay: string;
  price: number;
  icon: IconName;
}[] = [
  { id: 'free', title: 'Livraison standard', delay: '3 semaines', price: 0, icon: 'cube-outline' },
  { id: 'express', title: 'Livraison express', delay: '2 semaines', price: EXPRESS_SHIPPING_COST, icon: 'flash-outline' },
];

// Only cash on delivery is live on the web checkout for now; the others stay visible but disabled.
export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  title: string;
  description: string;
  icon: IconName;
  available: boolean;
}[] = [
  {
    id: 'cod',
    title: 'Paiement à la livraison',
    description: 'Payez en espèces au livreur, à la réception de vos articles.',
    icon: 'cash-outline',
    available: true,
  },
  {
    id: 'wave-money',
    title: 'Wave',
    description: 'Paiement mobile instantané.',
    icon: 'phone-portrait-outline',
    available: false,
  },
  {
    id: 'credit_card',
    title: 'Carte bancaire',
    description: 'Visa, Mastercard.',
    icon: 'card-outline',
    available: false,
  },
];

export const paymentMethodTitle = (id: PaymentMethodId) => PAYMENT_METHODS.find((m) => m.id === id)?.title ?? id;

export type AddressErrors = Partial<Record<keyof ShippingAddress, string>>;

export const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  suite: '',
  city: '',
  state: '',
  country: '',
  shippingOption: 'free',
};

/** The API answers with translation keys; the web app translates them, here they are mapped by hand. */
const PROMO_ERRORS: Record<string, string> = {
  promo_code_not_applicable: 'Ce code promo ne peut pas être appliqué à votre panier.',
  to_use_promo_code_you_must_be_logged_in: 'Connectez-vous pour utiliser un code promo.',
  invalid_promo_code: 'Code promo invalide.',
};

export const promoErrorMessage = (key: string) => PROMO_ERRORS[key] ?? 'Code promo invalide.';
