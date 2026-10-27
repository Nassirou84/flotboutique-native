import axios from '@/api/client';

export type PromoCodeResult = {
  success: boolean;
  amountAfterDiscount: number;
  discountedAmount: number;
};

/** Needs a signed-in user. Rejects with `{ error }` (a translation key) when the code does not apply. */
export const checkPromoCode = async (code: string): Promise<PromoCodeResult> => {
  const response = await axios.get<PromoCodeResult>(`/promo_codes/check/${encodeURIComponent(code)}`);
  return response.data;
};
