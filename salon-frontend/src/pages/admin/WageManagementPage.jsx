import { useCallback, useState } from 'react';
import { ReceiptText } from 'lucide-react';
import toast from 'react-hot-toast';
import { wagesApi } from '../../api/wages.api';
import { usersApi } from '../../api/users.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUSES = ['Pending', 'Paid', 'Hold'];

export default function WageManagementPage() {
  const [barber, setBarber] = useState('');
  const [status, setStatus] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [commissionDrafts, setCommissionDrafts] = useState({});

  const barbersFetcher = useCallback(() => usersApi.getBarbers().then((r) => r.data), []);
  const { data: barbers, refetch: refetchBarbers } = useFetch(barbersFetcher, []);

  const fetcher = useCallback(() => {
    const params = { ...(barber && { barber }), ...(status && { status }), limit: 50 };
    return wagesApi.getAll(params).then((r) => r.data);
  }, [barber, status]);
  const { data: wages, loading, refetch } = useFetch(fetcher, [barber, status]);

  const updateStatus = async (id, newStatus) => {
    setSavingId(id);
    try {
      await wagesApi.updateStatus(id, newStatus);
      toast.success(`Marked ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update');
    } finally {
      setSavingId(null);
    }
  };

  const saveCommission = async (barberId) => {
    const rate = commissionDrafts[barberId];
    if (rate === undefined || rate === '') return;
    try {
      await wagesApi.updateCommissionRate(barberId, Number(rate));
      toast.success('Commission rate updated');
      refetchBarbers();
    } catch (err) {
      toast.error(err.message || 'Could not update commission');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Wages" description="Commission rates and payout records for the team." />

      <Card className="mb-6 p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Commission rates</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {barbers?.map((b) => (
            <div key={b._id} className="flex items-center gap-3 rounded-md border border-ink-100 p-3">
              <Avatar name={b.name} tone="emerald" size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-700">{b.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={b.commissionRate}
                  onChange={(e) => setCommissionDrafts((d) => ({ ...d, [b._id]: e.target.value }))}
                  className="field w-16 px-2 py-1.5 text-sm"
                />
                <span className="text-xs text-ink-400">%</span>
                <button className="btn-ghost btn-sm" onClick={() => saveCommission(b._id)}>
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-6 flex flex-wrap gap-3">
        <Select label="Barber" value={barber} onChange={(e) => setBarber(e.target.value)} className="w-52">
          <option value="">All barbers</option>
          {barbers?.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </Select>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <PageLoader label="Loading wage records…" />
      ) : !wages?.data?.length ? (
        <EmptyState icon={ReceiptText} title="No wage records" description="Records appear as completed services are paid out." />
      ) : (
        <Table columns={['Barber', 'Date', 'Service', 'Amount', 'Commission', 'Tips', 'Total', 'Status']}>
          {wages.data.map((w) => (
            <tr key={w._id}>
              <td className="px-4 py-3 text-sm font-medium text-ink-700">{w.barber?.name}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{formatDate(w.date)}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{w.service?.name || '—'}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(w.serviceAmount)}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(w.commissionEarned)}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(w.tips)}</td>
              <td className="num px-4 py-3 text-sm font-semibold text-ink-800">{formatCurrency(w.totalEarning)}</td>
              <td className="px-4 py-3">
                <select
                  value={w.status}
                  disabled={savingId === w._id}
                  onChange={(e) => updateStatus(w._id, e.target.value)}
                  className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-medium text-ink-700 focus:border-brass-400 focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
