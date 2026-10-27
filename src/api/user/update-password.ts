import axios from '@/api/client';

/**
 * Sets a new password for the signed-in user (`ChangePasswordController::UpdateUserPassword`).
 * Like the web storefront, it does not ask for the current one. Rejects with `{ success: false, error }`.
 */
export const updatePassword = async (password: string): Promise<void> => {
  await axios.post('/change_password/update', { password });
};
