import axios, { endpoints } from '@/api/client';

export const requestPasswordReset = async (email: string): Promise<void> => {
  await axios.post(`/change_password/${email}/request`, { email });
};
