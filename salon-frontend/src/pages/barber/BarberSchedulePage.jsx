import { useCallback, useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentsApi } from '../../api/appointments.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { APPOINTMENT_STATUSES } from '../../utils/constants';
import { formatCurrency, formatDateShort, formatTime, todayISO } from '../../utils/formatters';

const NEXT_STATUS = {
  Pending: 'Confirmed',
  Confirmed: 'In Progress',
  'In Progress': 'Completed',
};

export default function BarberSchedulePage() {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetcher = useCallback(() => {
    const params = { ...(date ? { date } : {}), ...(status ? { status } : {}) };
    return appointmentsApi.getForBarber(params).then((r) => r.data);
  }, [date, status]);
  const { data: appointments, loading, refetch } = useFetch(fetcher, [date, status]);

  const advance = async (appt) => {
    const next = NEXT_STATUS[appt.status];
    if (!next) return;
    setUpdatingId(appt._id);
    try {
      await appointmentsApi.updateStatus(appt._id, next);
      toast.success(`Marked as ${next}`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Barber" title="My schedule" description="Move appointments through their day-of workflow." />

      <div className="mb-6 flex flex-wrap gap-3">
        <label className="block">
          <span className="field-label">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field w-44" />
        </label>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        {date && (
          <button className="btn-ghost mt-6" onClick={() => setDate('')}>
            Clear date
          </button>
        )}
        {!date && (
          <button className="btn-ghost mt-6" onClick={() => setDate(todayISO())}>
            Jump to today
          </button>
        )}
      </div>

      {loading ? (
        <PageLoader label="Loading schedule…" />
      ) : !appointments?.length ? (
        <EmptyState icon={CalendarCheck} title="Nothing here" description="No appointments match this filter." />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <Card key={a._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-base font-semibold text-ink-800">{a.service?.name}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-sm text-ink-400">
                  {a.customer?.name} · {a.customer?.phone} · {formatDateShort(a.date)} at {formatTime(a.timeSlot)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="num text-lg font-semibold text-ink-800">{formatCurrency(a.service?.price)}</span>
                {NEXT_STATUS[a.status] && (
                  <button className="btn-primary btn-sm" disabled={updatingId === a._id} onClick={() => advance(a)}>
                    {updatingId === a._id ? 'Updating…' : `Mark ${NEXT_STATUS[a.status]}`}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
