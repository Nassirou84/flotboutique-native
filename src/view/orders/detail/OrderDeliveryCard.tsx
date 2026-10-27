import type { OrderReceipt } from '@/api/order/orders';
import type { Order } from '@/types/order';

import { DetailCard, DetailRow } from './DetailCard';

type Props = { order: Order; receipt?: OrderReceipt['order'] };

export function OrderDeliveryCard({ order, receipt }: Props) {
  const address = receipt?.customer.address || [order.street, order.city, order.state, order.country].filter(Boolean).join(', ');

  return (
    <DetailCard title="Livraison">
      <DetailRow label="Destinataire" value={order.fullName} />
      {receipt?.customer.phone ? <DetailRow label="Téléphone" value={receipt.customer.phone} /> : null}
      {receipt?.customer.email ? <DetailRow label="E-mail" value={receipt.customer.email} /> : null}
      <DetailRow label="Adresse" value={address} />
      {receipt ? <DetailRow label="Mode" value={receipt.shipping_tier === 'Express' ? 'Express' : 'Standard'} /> : null}
    </DetailCard>
  );
}
