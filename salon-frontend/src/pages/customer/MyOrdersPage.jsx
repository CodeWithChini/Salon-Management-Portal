import { useCallback, useState } from 'react';
import { Package, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MyOrdersPage() {
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetcher = useCallback(() => ordersApi.getMy().then((r) => r.data), []);
  const { data: orders, loading, refetch } = useFetch(fetcher, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await ordersApi.cancel(cancelTarget._id);
      toast.success('Order cancelled');
      setCancelTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Retail" title="My orders" description="Track your product deliveries." />

      {loading ? (
        <PageLoader label="Loading orders…" />
      ) : !orders?.length ? (
        <EmptyState icon={Package} title="No orders yet" description="Your product purchases will show up here." />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
                <div>
                  <p className="text-sm font-semibold text-ink-800">Order #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-ink-400">{formatDate(o.createdAt?.split('T')[0])}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={o.status} />
                  <StatusBadge status={o.paymentStatus} />
                </div>
              </div>
              <ul className="divide-y divide-ink-50 py-2">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-ink-600">
                      {it.name} <span className="text-ink-300">× {it.quantity}</span>
                    </span>
                    <span className="num text-ink-700">{formatCurrency(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="num text-base font-semibold text-ink-800">Total: {formatCurrency(o.totalAmount)}</span>
                {['Pending', 'Processing'].includes(o.status) && (
                  <button className="btn-danger btn-sm" onClick={() => setCancelTarget(o)}>
                    <XCircle size={13} /> Cancel order
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        danger
        title="Cancel order?"
        confirmLabel="Cancel order"
        message="Stock will be restored and the order marked cancelled."
      />
    </div>
  );
}
