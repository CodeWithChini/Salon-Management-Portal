import { useCallback, useState } from 'react';
import { Users, History } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import { appointmentsApi } from '../../api/appointments.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatDateShort, formatTime } from '../../utils/formatters';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [historyFor, setHistoryFor] = useState(null);

  const fetcher = useCallback(() => usersApi.getAll({ role: 'Customer', search, limit: 25 }).then((r) => r.data), [search]);
  const { data: customers, loading } = useFetch(fetcher, [search]);

  const historyFetcher = useCallback(
    () => (historyFor ? appointmentsApi.getAll({ customer: historyFor._id, limit: 10 }).then((r) => r.data) : Promise.resolve([])),
    [historyFor]
  );
  const { data: history, loading: loadingHistory } = useFetch(historyFetcher, [historyFor?._id]);

  return (
    <div>
      <PageHeader eyebrow="Front desk" title="Customers" description="Look up a guest's contact details and visit history." />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" className="mb-6 sm:w-80" />

      {loading ? (
        <PageLoader label="Loading customers…" />
      ) : !customers?.length ? (
        <EmptyState icon={Users} title="No customers found" description="Try a different search." />
      ) : (
        <Table columns={['Customer', 'Email', 'Phone', 'Joined', '']}>
          {customers.map((c) => (
            <tr key={c._id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={c.name} tone="clay" size="sm" />
                  <span className="text-sm font-medium text-ink-700">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-ink-500">{c.email}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{c.phone || '—'}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{formatDateShort(c.createdAt?.split('T')[0])}</td>
              <td className="px-4 py-3 text-right">
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-800" onClick={() => setHistoryFor(c)}>
                  <History size={13} /> History
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={Boolean(historyFor)} onClose={() => setHistoryFor(null)} title={`${historyFor?.name}'s visits`} size="lg">
        {loadingHistory ? (
          <PageLoader label="Loading history…" />
        ) : !history?.data?.length ? (
          <p className="py-6 text-center text-sm text-ink-400">No appointment history yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {history.data.map((a) => (
              <li key={a._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink-700">{a.service?.name}</p>
                  <p className="text-xs text-ink-400">
                    with {a.barber?.name} · {formatDateShort(a.date)} at {formatTime(a.timeSlot)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
