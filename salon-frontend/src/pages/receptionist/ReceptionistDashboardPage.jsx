import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, Clock3, Users, ArrowRight } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard.api';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatTime } from '../../utils/formatters';

export default function ReceptionistDashboardPage() {
  const { user } = useAuth();
  const fetcher = useCallback(() => dashboardApi.getReceptionist().then((r) => r.data), []);
  const { data, loading } = useFetch(fetcher, []);

  if (loading) return <PageLoader label="Loading front desk…" />;

  const stats = data || {};

  return (
    <div>
      <PageHeader
        eyebrow="Receptionist"
        title={`Front desk, ${user.name.split(' ')[0]}`}
        description="Today's board at a glance."
        actions={
          <Link to="/app/receptionist/schedule" className="btn-primary">
            Open master schedule <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Appointments today" value={stats.todayCount || 0} icon={CalendarRange} tone="clay" />
        <StatCard label="Pending approval" value={stats.pendingCount || 0} icon={Clock3} tone="brass" />
        <StatCard label="Barbers available" value={stats.availableBarbers?.length || 0} icon={Users} tone="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Today's board</h3>
          {stats.todayAppointments?.length ? (
            <ul className="space-y-3">
              {stats.todayAppointments.map((a) => (
                <li key={a._id} className="flex items-center justify-between rounded-md border border-ink-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{formatTime(a.timeSlot)} · {a.service?.name}</p>
                    <p className="text-xs text-ink-400">{a.customer?.name} with {a.barber?.name}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarRange} title="Quiet day" description="Nothing booked yet for today." />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Awaiting confirmation</h3>
          {stats.pendingAppointments?.length ? (
            <ul className="space-y-3">
              {stats.pendingAppointments.map((a) => (
                <li key={a._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{a.customer?.name}</p>
                    <p className="text-xs text-ink-400">{a.service?.name} with {a.barber?.name}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-400">Nothing waiting on approval.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
