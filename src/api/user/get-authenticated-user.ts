import axios from '@/api/client';
import type { User } from '@/types/user';

/** `CurrentlyLoginController`: the signed-in user as the server holds it now (addresses, devices, 2FA...). */
export const getAuthenticatedUser = async (): Promise<User> => (await axios.get<{ user: User }>('/authenticated')).data.user;
