export const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

const capitalize = (s: string) => s.replace(/(^|\s)(\S)/g, (_, space, c) => space + c.toUpperCase());

/** Delivery window `minDays` to `maxDays` from today, as capitalized French dates. */
export const formatDeliveryWindow = (minDays: number, maxDays: number, from = new Date()) => ({
  start: capitalize(DATE_FORMAT.format(new Date(from.getTime() + minDays * DAY_MS))),
  end: capitalize(DATE_FORMAT.format(new Date(from.getTime() + maxDays * DAY_MS))),
});

const LONG_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** `2026-10-26T10:00:00+00:00` -> `26 octobre 2026`. Empty for a missing or invalid date. */
export const formatLongDate = (iso?: string) => {
  const date = iso ? new Date(iso) : null;
  return date && !Number.isNaN(date.getTime()) ? LONG_DATE_FORMAT.format(date) : '';
};

const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });

/** "À l'instant", "Il y a 10 min", "Il y a 2 h", "Hier à 14:30", "Il y a 3 jours", then the long date. */
export const formatRelativeTime = (date: Date, now = new Date()) => {
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (date.toDateString() === now.toDateString()) return `Il y a ${Math.floor(minutes / 60)} h`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Hier à ${TIME_FORMAT.format(date)}`;

  const days = Math.floor(minutes / 1440);
  return days < 7 ? `Il y a ${days} jours` : formatLongDate(date.toISOString());
};
