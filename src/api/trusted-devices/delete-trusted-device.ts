import axios from '@/api/client';

/** Forgets a trusted device: the next sign-in from it asks for a 2FA code again. Owner or admin only. */
export const deleteTrustedDevice = async (deviceId: string | number): Promise<void> => {
  await axios.delete(`/trusted_devices/${deviceId}`);
};
