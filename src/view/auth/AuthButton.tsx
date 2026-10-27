import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  /** Puts the icon after the label instead of before it. */
  iconRight?: boolean;
  loading?: boolean;
  onPress: () => void;
};

export function AuthButton({ label, icon, iconRight, loading, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, (pressed || loading) && { opacity: 0.85 }]}
      accessibilityRole="button"
      accessibilityState={{ busy: loading }}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon && !iconRight ? <Ionicons name={icon} size={18} color="#fff" /> : null}
          <Text style={styles.text}>{label}</Text>
          {icon && iconRight ? <Ionicons name={icon} size={18} color="#fff" /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
