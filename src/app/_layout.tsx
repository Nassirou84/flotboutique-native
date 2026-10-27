import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from 'react-native-pretty-toast';

import { AuthProvider } from '@/auth/auth-provider';
import { BasketProvider } from '@/providers/basket-provider';
import { CurrencyProvider } from '@/providers/currency-provider';
import { QueryProvider } from '@/providers/query-provider';
import { WishlistProvider } from '@/providers/wishlist-provider';

export default function RootLayout() {
  return (
    <ToastProvider>
      <QueryProvider>
        <CurrencyProvider>
          <AuthProvider>
            <BasketProvider>
              <WishlistProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
              </WishlistProvider>
            </BasketProvider>
          </AuthProvider>
        </CurrencyProvider>
      </QueryProvider>
    </ToastProvider>
  );
}
