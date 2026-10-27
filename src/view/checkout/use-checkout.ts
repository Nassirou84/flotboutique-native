import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { checkPromoCode } from '@/api/order/check-promo-code';
import { useFinalizeOrder, type OrderConfirmation, type PaymentMethodId } from '@/api/order/place-order';
import { useAuth } from '@/auth/auth-provider';
import { useBasket } from '@/providers/basket-provider';
import type { ShippingAddress, User } from '@/types/user';
import { getErrorMessage } from '@/utils/errors';
import { notifyError } from '@/utils/notify';

import {
  EMPTY_ADDRESS,
  EXPRESS_SHIPPING_COST,
  promoErrorMessage,
  type AddressErrors,
  type CheckoutStep,
} from './constants';

export type AppliedPromo = { code: string; discount: number };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same unit price the API totals with (`Basket::getTotalAmount()`).
const unitPrice = (item: { product: { actualPrice?: number | null }; priceAtAdd?: number }) =>
  item.product.actualPrice ?? item.priceAtAdd ?? 0;

const addressFromUser = (user: User): Partial<ShippingAddress> => {
  const saved = user.addresses?.find((a) => a.isDefault) ?? user.addresses?.[0];
  return {
    fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    email: user.email,
    phone: user.phone ?? '',
    street: saved?.street ?? user.street ?? '',
    suite: saved?.suite ?? '',
    city: saved?.city ?? user.city ?? '',
    state: saved?.state ?? user.state ?? '',
  };
};

const validate = (a: ShippingAddress): AddressErrors => {
  const errors: AddressErrors = {};
  if (!a.fullName.trim()) errors.fullName = 'Saisissez votre nom complet.';
  if (!a.email.trim()) errors.email = 'Saisissez votre adresse email.';
  else if (!EMAIL_PATTERN.test(a.email.trim())) errors.email = 'Adresse email invalide.';
  if (!a.phone.trim()) errors.phone = 'Saisissez votre numéro de téléphone.';
  if (!a.street.trim()) errors.street = 'Saisissez votre adresse.';
  if (!a.city.trim()) errors.city = 'Saisissez votre ville.';
  if (!a.state.trim()) errors.state = 'Saisissez votre commune ou région.';
  return errors;
};

export function useCheckout() {
  const { user } = useAuth();
  const { basket, items, clearBasket } = useBasket();
  const { mutateAsync: finalizeOrder, isPending: placing } = useFinalizeOrder();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const prefilled = useRef(false);

  // Fill the form from the account once, without overwriting what was already typed.
  useEffect(() => {
    if (!user || prefilled.current) return;
    prefilled.current = true;
    const fromUser = addressFromUser(user);
    setAddress((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(fromUser) as [keyof ShippingAddress, string][]) {
        if (!prev[key] && value) (next[key] as string) = value;
      }
      return next;
    });
  }, [user]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
    const discount = Math.min(promo?.discount ?? 0, subtotal);
    const shipping = address.shippingOption === 'express' ? EXPRESS_SHIPPING_COST : 0;
    return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping) };
  }, [items, promo, address.shippingOption]);

  const updateAddress = useCallback(<K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const applyPromo = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) {
        setPromoError('Saisissez un code promo.');
        return;
      }
      if (!user) {
        setPromoError(promoErrorMessage('to_use_promo_code_you_must_be_logged_in'));
        return;
      }
      setCheckingPromo(true);
      setPromoError('');
      try {
        const result = await checkPromoCode(code);
        if (!result.success) throw new Error('invalid_promo_code');
        setPromo({ code, discount: result.discountedAmount });
      } catch (error) {
        setPromo(null);
        setPromoError(promoErrorMessage(getErrorMessage(error, 'invalid_promo_code')));
      } finally {
        setCheckingPromo(false);
      }
    },
    [user],
  );

  const removePromo = useCallback(() => {
    setPromo(null);
    setPromoError('');
  }, []);

  const submit = useCallback(async () => {
    if (!basket?.uid || items.length === 0) {
      notifyError('Votre panier est vide.');
      return;
    }
    try {
      const result = await finalizeOrder({
        shippingAddress: {
          ...address,
          fullName: address.fullName.trim(),
          email: address.email.trim(),
          phone: address.phone.trim(),
          street: address.street.trim(),
          suite: address.suite?.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
        },
        basketUid: basket.uid,
        paymentMethod,
        promoCode: promo?.code,
      });
      setConfirmation(result);
      // The API does not empty the basket when the order is placed.
      await clearBasket();
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de finaliser la commande.'), 'Commande impossible');
    }
  }, [address, basket, clearBasket, finalizeOrder, items.length, paymentMethod, promo]);

  const next = useCallback(() => {
    if (step === 1) {
      const found = validate(address);
      setErrors(found);
      if (Object.keys(found).length > 0) {
        notifyError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      submit();
    }
  }, [address, step, submit]);

  const back = useCallback(() => {
    if (step > 1) setStep((step - 1) as CheckoutStep);
    else if (router.canGoBack()) router.back();
    else router.replace('/panier');
  }, [step]);

  return {
    user,
    items,
    step,
    setStep,
    address,
    errors,
    updateAddress,
    paymentMethod,
    setPaymentMethod,
    promo,
    promoError,
    checkingPromo,
    applyPromo,
    removePromo,
    totals,
    placing,
    confirmation,
    next,
    back,
  };
}

export type CheckoutState = ReturnType<typeof useCheckout>;
