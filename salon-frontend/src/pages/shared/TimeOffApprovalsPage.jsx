import { useCallback, useState } from 'react';
import { ClipboardList, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatDate } from '../../utils/formatters';

export default function TimeOffApprovalsPage() {
  const [status, setStatus] = useState('Pending');
  const [savingId, setSavingId] = useState(null);

  const fetcher = useCallback(() => staffApi.getAllTimeOffs(status ? { status } : {}).then((r) => r.data), [status]);
  const { data: requests, loading, refetch } = useFetch(fetcher, [status]);

  const decide = async (id, decision) => {
    setSavingId(id);
    try {
      await staffApi.updateTimeOffStatus(id, decision);
      toast.success(`Request ${decision.toLowerCase()}`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update request');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Staffing" title="Time-off requests" description="Approve or decline leave requests from the team." />

      <Select value={status} onChange={(e) => setStatus(e.target.value)} className="mb-6 w-52">
        <option value="">All requests</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </Select>

      {loading ? (
        <PageLoader label="Loading requests…" />
      ) : !requests?.length ? (
        <EmptyState icon={ClipboardList} title="Nothing to review" description="No time-off requests match this filter." />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={r.barber?.name} tone="emerald" />
                <div>
                  <p className="text-sm font-semibold text-ink-800">{r.barber?.name}</p>
                  <p className="text-xs text-ink-400">
                    {formatDate(r.startDate)} — {formatDate(r.endDate)}
                  </p>
                  {r.reason && <p className="mt-0.5 text-xs text-ink-400">"{r.reason}"</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={r.status} />
                {r.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button className="btn-outline btn-sm" disabled={savingId === r._id} onClick={() => decide(r._id, 'Approved')}>
                      <Check size={13} /> Approve
                    </button>
                    <button className="btn-danger btn-sm" disabled={savingId === r._id} onClick={() => decide(r._id, 'Rejected')}>
                      <X size={13} /> Decline
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
