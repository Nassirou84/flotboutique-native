import type { OrderReceipt } from '@/api/order/orders';
import { colors } from '@/theme/colors';
import { paymentMethodTitle } from '@/view/checkout/constants';

import { PAYMENT_STATUS_LABELS } from '../constants';
import { DetailCard, DetailRow } from './DetailCard';

export function OrderPaymentCard({ payment }: { payment: OrderReceipt['order']['payment'] }) {
  const completed = payment.status === 'completed';

  return (
    <DetailCard title="Paiement">
      <DetailRow label="Mode" value={paymentMethodTitle(payment.method as Parameters<typeof paymentMethodTitle>[0])} />
      <DetailRow
        label="Statut"
        value={PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
        valueStyle={{ color: completed ? colors.green : colors.orange }}
      />
      {payment.last4 ? <DetailRow label="Compte" value={payment.last4} /> : null}
      {payment.transactionId ? <DetailRow label="Transaction" value={payment.transactionId} /> : null}
    </DetailCard>
  );
}
