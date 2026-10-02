import { useCallback, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { staffApi } from '../../api/staff.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { todayISO } from '../../utils/formatters';

export default function StaffAvailabilityPage() {
  const [date, setDate] = useState(todayISO());

  const fetcher = useCallback(() => staffApi.getAvailability(date).then((r) => r.data), [date]);
  const { data: availability, loading } = useFetch(fetcher, [date]);

  return (
    <div>
      <PageHeader eyebrow="Front desk" title="Staff availability" description="See who's working, off, or on leave for a given day." />

      <label className="mb-6 block max-w-xs">
        <span className="field-label">Date</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
      </label>

      {loading ? (
        <PageLoader label="Checking rosters…" />
      ) : !availability?.length ? (
        <EmptyState icon={CalendarClock} title="No active barbers" description="Add barbers under Staff to see availability." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availability.map((b) => (
            <Card key={b._id} className="flex items-center gap-3 p-4">
              <Avatar name={b.name} tone="emerald" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-800">{b.name}</p>
                <p className="truncate text-xs text-ink-400">{(b.specializations || []).join(', ') || 'General'}</p>
              </div>
              <span
                className={`chip ${
                  b.isOnLeave
                    ? 'bg-clay-100 text-clay-600'
                    : b.isWorking
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-stone-200 text-ink-500'
                }`}
              >
                {b.isOnLeave ? 'On leave' : b.isWorking ? 'Working' : 'Off today'}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
