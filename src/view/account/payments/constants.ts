export const BRAND_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  diners: 'Diners Club',
  jcb: 'JCB',
};

export const PROVIDER_LABELS: Record<string, string> = {
  wave: 'Wave Mobile Money',
  orange: 'Orange Money',
};

export const providerLabel = (provider?: string | null) =>
  (provider && PROVIDER_LABELS[provider.toLowerCase()]) || 'Mobile Money';

export const brandLabel = (brand?: string | null) => (brand && BRAND_LABELS[brand.toLowerCase()]) || 'Carte bancaire';

const digits = (value: string) => value.replace(/\D/g, '');

/** `4242424242424242` -> `4242 4242 4242 4242`. The API only accepts 16 digits. */
export const formatCardNumber = (value: string) => digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

/** `1228` -> `12/28`. */
export const formatExpiry = (value: string) => {
  const raw = digits(value).slice(0, 4);
  return raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
};

/** Ivorian mobile numbers have 10 digits after +225: `0700000000` -> `07 00 00 00 00`. */
export const formatMobileNumber = (value: string) => digits(value).slice(0, 10).replace(/(\d{2})(?=\d)/g, '$1 ');

export const MOBILE_COUNTRY_CODE = '+225';

export const isLuhnValid = (cardNumber: string) => {
  let sum = 0;
  let double = false;
  for (const char of digits(cardNumber).split('').reverse()) {
    let n = Number(char);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
};

/** `MM/YY`, not past: valid through the last day of that month, as the API checks. */
export const isExpiryValid = (expiry: string) => {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const endOfMonth = new Date(2000 + Number(match[2]), Number(match[1]), 0, 23, 59, 59);
  return endOfMonth >= new Date();
};

export type CardErrors = Partial<Record<'cardHolderName' | 'cardNumber' | 'expiry' | 'cvv', string>>;

export const validateCard = (
  form: { cardHolderName: string; cardNumber: string; expiry: string; cvv: string },
  fields: (keyof CardErrors)[],
): CardErrors => {
  const errors: CardErrors = {};
  if (fields.includes('cardHolderName') && form.cardHolderName.trim().length < 2) {
    errors.cardHolderName = 'Saisissez le nom du titulaire.';
  }
  if (fields.includes('cardNumber')) {
    const number = digits(form.cardNumber);
    if (number.length !== 16 || !isLuhnValid(number)) errors.cardNumber = 'Saisissez un numéro de carte valide à 16 chiffres.';
  }
  if (fields.includes('expiry') && !isExpiryValid(form.expiry)) errors.expiry = 'Date invalide ou expirée (MM/AA).';
  if (fields.includes('cvv') && digits(form.cvv).length !== 3) errors.cvv = 'Saisissez le code à 3 chiffres.';
  return errors;
};
