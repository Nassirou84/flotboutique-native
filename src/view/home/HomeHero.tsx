import { View } from 'react-native';

import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel';

import { goToCatalogue } from './navigation';

const SLIDES: HeroSlide[] = [
  {
    id: 'black-november',
    badge: 'OFFRE SPÉCIALE 3 ÉTATS',
    title: 'Black November Abidjan',
    subtitle: "Jusqu'à -45% sur MacBooks & iPhones...",
    cta: 'Découvrir la sélection',
    onPress: () => goToCatalogue(),
  },
  {
    id: 'neuf',
    badge: 'NEUF SCELLÉ',
    title: 'Garantie constructeur',
    subtitle: '12 mois de garantie sur tous les neufs',
    cta: 'Voir les neufs',
    onPress: () => goToCatalogue({ condition: 'neuf' }),
  },
  {
    id: 'recond',
    badge: 'RECONDITIONNÉ A+',
    title: 'Testé en 40 points',
    subtitle: 'Atelier Cocody, Flot Care 6 mois inclus',
    cta: 'Voir les reconditionnés',
    onPress: () => goToCatalogue({ condition: 'reconditionne' }),
  },
];

export function HomeHero() {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <HeroCarousel slides={SLIDES} />
    </View>
  );
}
