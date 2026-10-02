import { useCallback, useState } from 'react';
import { CalendarRange, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentsApi } from '../../api/appointments.api';
import { usersApi } from '../../api/users.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import Modal from '../../components/ui/Modal';
import { APPOINTMENT_STATUSES } from '../../utils/constants';
import { formatCurrency, formatDateShort, formatTime } from '../../utils/formatters';

export default function AppointmentsBoardPage() {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [barber, setBarber] = useState('');
  const [page, setPage] = useState(1);
  const [reassignTarget, setReassignTarget] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [saving, setSaving] = useState(null);

  const fetcher = useCallback(
    () => appointmentsApi.getAll({ page, limit: 15, ...(status && { status }), ...(date && { date }), ...(barber && { barber }) }),
    [status, date, barber, page]
  );
  const { data, loading, refetch } = useFetch(fetcher, [status, date, barber, page]);

  const barbersFetcher = useCallback(() => usersApi.getBarbers().then((r) => r.data), []);
  const { data: barbers } = useFetch(barbersFetcher, []);

  const appointments = data?.data || [];
  const pagination = data?.pagination;

  const updateStatus = async (id, newStatus) => {
    setSaving(id);
    try {
      await appointmentsApi.updateStatus(id, newStatus);
      toast.success(`Marked as ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    } finally {
      setSaving(null);
    }
  };

  const handleReassign = async () => {
    if (!reassignTo) return;
    setSaving(reassignTarget._id);
    try {
      await appointmentsApi.assignBarber(reassignTarget._id, reassignTo);
      toast.success('Barber reassigned');
      setReassignTarget(null);
      setReassignTo('');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not reassign');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Scheduling" title="Master schedule" description="Every appointment in the shop, filterable and editable." />

      <div className="mb-6 flex flex-wrap gap-3">
        <label className="block">
          <span className="field-label">Date</span>
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} className="field w-44" />
        </label>
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
          <option value="">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select label="Barber" value={barber} onChange={(e) => { setBarber(e.target.value); setPage(1); }} className="w-52">
          <option value="">All barbers</option>
          {barbers?.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </Select>
        {(date || status || barber) && (
          <button className="btn-ghost mt-6" onClick={() => { setDate(''); setStatus(''); setBarber(''); setPage(1); }}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <PageLoader label="Loading schedule…" />
      ) : !appointments.length ? (
        <EmptyState icon={CalendarRange} title="No appointments" description="Nothing matches these filters." />
      ) : (
        <>
          <Table columns={['Customer', 'Barber', 'Service', 'When', 'Amount', 'Status', '']}>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td className="px-4 py-3 text-sm text-ink-700">{a.customer?.name}</td>
                <td className="px-4 py-3 text-sm text-ink-700">{a.barber?.name}</td>
                <td className="px-4 py-3 text-sm text-ink-700">{a.service?.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-500">
                  {formatDateShort(a.date)} · {formatTime(a.timeSlot)}
                </td>
                <td className="num px-4 py-3 text-sm text-ink-700">{formatCurrency(a.totalAmount)}</td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    disabled={saving === a._id}
                    onChange={(e) => updateStatus(a._id, e.target.value)}
                    className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-medium text-ink-700 focus:border-brass-400 focus:outline-none"
                  >
                    {APPOINTMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800"
                    onClick={() => setReassignTarget(a)}
                  >
                    <UserCog size={13} /> Reassign
                  </button>
                </td>
              </tr>
            ))}
          </Table>

          {pagination?.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-ink-400">
              <span>
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
              </span>
              <div className="flex gap-2">
                <button className="btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={14} /> Prev
                </button>
                <button className="btn-outline btn-sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={Boolean(reassignTarget)}
        onClose={() => setReassignTarget(null)}
        title="Reassign barber"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setReassignTarget(null)}>Cancel</button>
            <button className="btn-primary btn-sm" disabled={!reassignTo} onClick={handleReassign}>Save</button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ink-500">
          Moving <strong>{reassignTarget?.customer?.name}</strong>'s {reassignTarget?.service?.name} appointment to:
        </p>
        <Select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
          <option value="">Choose a barber…</option>
          {barbers?.filter((b) => b._id !== reassignTarget?.barber?._id).map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}
