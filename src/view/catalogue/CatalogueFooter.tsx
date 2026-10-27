import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ReturnPolicyBanner } from '@/components/ReturnPolicyBanner';
import { colors } from '@/theme/colors';

export function CatalogueFooter({ loadingMore }: { loadingMore: boolean }) {
  return (
    <View style={styles.footer}>
      {loadingMore ? <ActivityIndicator color={colors.primary} style={styles.more} /> : null}
      <ReturnPolicyBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  more: { marginBottom: 16 },
  footer: { paddingHorizontal: 16, paddingTop: 16 },
});
