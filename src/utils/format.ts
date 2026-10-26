export const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
