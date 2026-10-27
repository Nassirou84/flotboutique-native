import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

// Same terms as the storefront's returns guide (`ret…` keys of its French locale).
const STATS = [
  { value: '10 jours', label: 'Délai de retour après livraison' },
  { value: '48 h', label: 'Étude de votre demande' },
  { value: '3 à 5 jours', label: 'Remboursement après contrôle' },
];

const STEPS = [
  { title: 'Contactez le support', text: 'Envoyez-nous votre numéro de commande et le motif du retour.' },
  { title: 'Recevez la confirmation', text: 'Nous validons votre demande et vous indiquons la marche à suivre.' },
  { title: 'Renvoyez l’article', text: 'Emballez l’article avec ses accessoires et remettez-le au livreur.' },
  { title: 'Soyez remboursé', text: 'Après contrôle, vous êtes remboursé via votre moyen de paiement d’origine.' },
];

const ELIGIBLE = [
  'Demande faite sous 10 jours après la livraison',
  'Article non utilisé ou dans l’état reçu',
  'Emballage d’origine, accessoires et étiquettes inclus',
  'Preuve d’achat ou numéro de commande fourni',
];

const NOT_ELIGIBLE = [
  'Demande faite après le délai de 10 jours',
  'Article endommagé après la livraison',
  'Accessoires ou emballage d’origine manquants',
  'Articles dont le scellé d’hygiène est brisé',
];

function Checklist({ title, items, good }: { title: string; items: string[]; good: boolean }) {
  const tint = good ? colors.green : colors.danger;
  return (
    <View style={styles.list}>
      <Text style={[styles.listTitle, { color: tint }]}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.listRow}>
          <Ionicons name={good ? 'checkmark-circle' : 'close-circle'} size={16} color={tint} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/** Explains how returns work: timeline, steps and what is (not) eligible. */
export function ReturnPolicyBanner() {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Ionicons name="return-down-back-outline" size={22} color="#1D4ED8" />
        </View>
        <View style={styles.headText}>
          <Text style={styles.title}>Politique de retour</Text>
          <Text style={styles.subtitle}>
            Tout ce qu’il faut savoir pour retourner un article simplement et sans surprise.
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        {STATS.map((s) => (
          <View key={s.value} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Comment retourner un article</Text>
      {STEPS.map((step, index) => (
        <View key={step.title} style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.text}>{step.text}</Text>
          </View>
        </View>
      ))}

      <Checklist title="Éligible au retour" items={ELIGIBLE} good />
      <Checklist title="Non éligible au retour" items={NOT_ELIGIBLE} good={false} />

      <Text style={styles.note}>
        Les délais de remboursement sont indicatifs et peuvent dépendre de votre moyen de paiement.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  head: { flexDirection: 'row', gap: 14 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DDE5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, gap: 2, padding: 10, borderRadius: 10, backgroundColor: '#DDE5FB' },
  statValue: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
  statLabel: { fontSize: 11, lineHeight: 15, color: '#1E293B' },
  section: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginTop: 4 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 13.5, fontWeight: '700', color: '#1E293B' },
  text: { fontSize: 13, lineHeight: 19, color: colors.textMuted },
  list: { gap: 6, padding: 12, borderRadius: 10, backgroundColor: colors.surface },
  listTitle: { fontSize: 13, fontWeight: '800' },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  listText: { flex: 1, fontSize: 13, lineHeight: 18, color: '#1E293B' },
  note: { fontSize: 11.5, lineHeight: 16, color: colors.textMuted },
});
