import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConditionCards } from '@/components/ConditionCards';
import { FlashSale } from '@/components/FlashSale';
import { HomeHeader } from '@/components/HomeHeader';
import { WhyFlot } from '@/components/WhyFlot';
import { colors } from '@/theme/colors';

import { FLASH_ENDS_AT } from './constants';
import { HomeHero } from './HomeHero';
import { HomeRecommended } from './HomeRecommended';
import { HomeSearchBox } from './HomeSearchBox';
import { HomeSection } from './HomeSection';
import { goToCatalogue } from './navigation';

export function HomeView() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <HomeHeader />
        </View>
        <HomeSearchBox onSearch={(q) => goToCatalogue({ q })} />
        <HomeHero />

        <HomeSection title="Nos 3 États Certifiés" action={{ label: "Guide d'achat", icon: 'help-circle-outline' }}>
          <ConditionCards onSelect={(condition) => goToCatalogue({ condition })} />
        </HomeSection>

        <View style={styles.pad}>
          <FlashSale endsAt={FLASH_ENDS_AT} />
        </View>

        <HomeRecommended />

        <View style={styles.pad}>
          <WhyFlot />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 8, paddingBottom: 28, gap: 18 },
  pad: { paddingHorizontal: 16 },
});
