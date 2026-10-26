import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useBasket } from '@/providers/basket-provider';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  outline,
  filled,
  color,
  focused,
}: {
  outline: IconName;
  filled: IconName;
  color: ColorValue;
  focused: boolean;
}) {
  return <Ionicons name={focused ? filled : outline} size={24} color={color as string} />;
}

const icon =
  (outline: IconName, filled: IconName) =>
  // eslint-disable-next-line react/display-name
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <TabIcon outline={outline} filled={filled} color={color} focused={focused} />
  );

export default function TabLayout() {
  const { basketCount } = useBasket();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarBadgeStyle: { backgroundColor: colors.primary, color: '#fff', fontSize: 10 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen
        name="catalogue"
        options={{ title: 'Catalogue', tabBarIcon: icon('grid-outline', 'grid') }}
      />
      <Tabs.Screen
        name="panier"
        options={{
          title: 'Panier',
          tabBarIcon: icon('bag-outline', 'bag'),
          tabBarBadge: basketCount > 0 ? basketCount : undefined,
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{ title: 'Commandes', tabBarIcon: icon('bus-outline', 'bus') }}
      />
      <Tabs.Screen
        name="compte"
        options={{ title: 'Compte', tabBarIcon: icon('person-outline', 'person') }}
      />
    </Tabs>
  );
}
