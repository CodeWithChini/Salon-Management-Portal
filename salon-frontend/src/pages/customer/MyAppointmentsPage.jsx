import { useCallback, useState } from 'react';
import { CalendarCheck, RotateCcw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentsApi } from '../../api/appointments.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import RescheduleModal from './components/RescheduleModal';
import { formatCurrency, formatDateShort, formatTime } from '../../utils/formatters';

const TABS = [
  { value: '', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function MyAppointmentsPage() {
  const [tab, setTab] = useState('upcoming');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetcher = useCallback(() => {
    const params = tab === 'upcoming' ? { upcoming: 'true' } : tab ? { status: tab } : {};
    return appointmentsApi.getMy(params).then((r) => r.data);
  }, [tab]);
  const { data: appointments, loading, refetch } = useFetch(fetcher, [tab]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await appointmentsApi.cancel(cancelTarget._id, 'Cancelled by customer');
      toast.success('Appointment cancelled');
      setCancelTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not cancel');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Bookings" title="My appointments" description="Track, reschedule, or cancel your visits." />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {loading ? (
          <PageLoader label="Loading appointments…" />
        ) : !appointments?.length ? (
          <EmptyState icon={CalendarCheck} title="No appointments here" description="Nothing matches this filter yet." />
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => {
              const canManage = ['Pending', 'Confirmed'].includes(a.status);
              return (
                <Card key={a._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-base font-semibold text-ink-800">{a.service?.name}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-400">
                      with {a.barber?.name} · {formatDateShort(a.date)} at {formatTime(a.timeSlot)}
                    </p>
                    {a.cancellationReason && a.status === 'Cancelled' && (
                      <p className="mt-1 text-xs text-clay-500">Reason: {a.cancellationReason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="num text-lg font-semibold text-ink-800">{formatCurrency(a.totalAmount)}</span>
                    {canManage && (
                      <div className="flex gap-2">
                        <button className="btn-outline btn-sm" onClick={() => setRescheduleTarget(a)}>
                          <RotateCcw size={13} /> Reschedule
                        </button>
                        <button className="btn-danger btn-sm" onClick={() => setCancelTarget(a)}>
                          <XCircle size={13} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        danger
        title="Cancel appointment?"
        confirmLabel="Cancel appointment"
        message={`This will cancel your ${cancelTarget?.service?.name} appointment with ${cancelTarget?.barber?.name}.`}
      />

      <RescheduleModal appointment={rescheduleTarget} onClose={() => setRescheduleTarget(null)} onDone={refetch} />
    </div>
  );
}
