/** Fields of `PaymentMethod` in the API's `card:list` group. The card number and CVV are never returned. */
export interface PaymentMethod {
  id: number;
  method: 'card' | 'mobile_payment';
  expiry?: string | null;
  cardHolderName?: string | null;
  lastFourDigits?: string | null;
  /** Detected by the API from the card number: `visa`, `mastercard`, `amex`... */
  cardBrand?: string | null;
  mobileProvider?: string | null;
  isDefault?: boolean | null;
  isActive?: boolean;
}
