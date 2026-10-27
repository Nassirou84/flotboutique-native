import type { Address } from '@/types/user';

/** The web storefront's default (`NEXT_PUBLIC_APP_CURRENT_COUNTRY`). */
export const DEFAULT_COUNTRY = "Côte d'Ivoire";

export const EMPTY_ADDRESS: Address = {
  street: '',
  suite: '',
  city: '',
  state: '',
  country: DEFAULT_COUNTRY,
  isDefault: false,
};

export type AddressErrors = Partial<Record<'street' | 'city' | 'state', string>>;

/** Same required fields as the web's `AddressModal`: street, city (commune) and state (ville). */
export const validateAddress = (a: Address): AddressErrors => {
  const errors: AddressErrors = {};
  if (!a.street.trim()) errors.street = 'Saisissez la rue.';
  if (!a.city.trim()) errors.city = 'Saisissez la commune.';
  if (!a.state.trim()) errors.state = 'Saisissez la ville.';
  return errors;
};
