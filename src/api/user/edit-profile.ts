import axios from '@/api/client';
import type { User } from '@/types/user';

export type EditableProfile = Pick<User, 'firstName' | 'lastName' | 'phone' | 'addresses' | 'twoFactor' | 'deliveryPin'>;

/**
 * `EditCurrentUserController`: only the fields that are sent are changed. Rejects with `{ error }`
 * when a name is empty or a value is not a string. Resolves to the fields the server now holds.
 */
export const editProfile = async (data: Partial<EditableProfile>): Promise<Partial<EditableProfile>> => {
  const { user } = (await axios.post<{ user: Partial<EditableProfile> }>('/edit-me', data)).data;
  // Fall back to what was sent for a field the response leaves out.
  return { ...data, ...Object.fromEntries(Object.entries(user).filter(([key]) => key in data)) };
};
