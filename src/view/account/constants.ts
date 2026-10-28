import type { User } from '@/types/user';
import type { IconName } from '@/view/orders/constants';

export type MenuItem = {
  key: string;
  icon: IconName;
  label: string;
  /** Secondary line under the label. */
  subtitle?: string;
  /** Short status shown on the right, before the chevron. */
  value?: string;
  valueTone?: 'good' | 'muted';
  /** Route to open; the row falls back to the "coming soon" notice when it is missing. */
  href?: '/mot-de-passe-oublie' | '/modifier-telephone' | '/adresses' | '/modifier-mot-de-passe' | '/double-authentification' | '/appareils-de-confiance' | '/moyens-de-paiement' | '/code-pin-livraison';
};

export type MenuSection = { key: string; title: string; items: MenuItem[] };

export const formatMemberSince = (createdAt?: string) => {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return `Membre depuis ${date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
};

export const buildMenu = (user: User): MenuSection[] => {
  const main = user.addresses?.find((a) => a.isDefault) ?? user.addresses?.[0];
  const place = main ? [main.city, main.state].filter(Boolean).join(', ') : '';
  const devices = user.trustedDevices?.length ?? 0;

  return [
    {
      key: 'profile',
      title: 'Mon profil',
      items: [
        {
          key: 'phone',
          icon: 'call-outline',
          label: 'Numéro de téléphone',
          subtitle: user.phone || 'Ajoutez votre numéro de téléphone',
          href: '/modifier-telephone',
        },
        {
          key: 'addresses',
          icon: 'location-outline',
          label: 'Adresses de livraison',
          subtitle: place || 'Aucune adresse enregistrée',
          href: '/adresses',
        },
        {
          key: 'payments',
          icon: 'card-outline',
          label: 'Moyens de paiement',
          subtitle: 'Cartes, Wave et Orange Money',
          href: '/moyens-de-paiement',
        },
      ],
    },
    {
      key: 'security',
      title: 'Sécurité',
      items: [
        {
          key: 'password',
          icon: 'lock-closed-outline',
          label: 'Mot de passe',
          subtitle: 'Modifier mon mot de passe',
          href: '/modifier-mot-de-passe',
        },
        {
          key: 'two-factor',
          icon: 'shield-checkmark-outline',
          label: 'Double authentification',
          href: '/double-authentification',
          value: user.twoFactor ? 'Activée' : 'Désactivée',
          valueTone: user.twoFactor ? 'good' : 'muted',
        },
        {
          key: 'devices',
          icon: 'phone-portrait-outline',
          label: 'Appareils de confiance',
          href: '/appareils-de-confiance',
          value: devices > 0 ? String(devices) : undefined,
        },
        {
          key: 'delivery-pin',
          icon: 'keypad-outline',
          label: 'Code PIN de livraison',
          subtitle: 'À demander par le livreur avant remise du colis',
          href: '/code-pin-livraison',
          value: user.deliveryPin ? 'Défini' : 'Non défini',
          valueTone: user.deliveryPin ? 'good' : 'muted',
        },
      ],
    },
    {
      key: 'help',
      title: 'Aide',
      items: [
        { key: 'faq', icon: 'help-circle-outline', label: 'Centre d’aide' },
        { key: 'contact', icon: 'headset-outline', label: 'Contacter le support' },
        { key: 'legal', icon: 'document-text-outline', label: 'Conditions & confidentialité' },
      ],
    },
  ];
};
