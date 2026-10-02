import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Wallet, Percent, CheckCircle2, ArrowRight } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard.api';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency, formatTime, formatDateShort } from '../../utils/formatters';

export default function BarberDashboardPage() {
  const { user } = useAuth();
  const fetcher = useCallback(() => dashboardApi.getBarber().then((r) => r.data), []);
  const { data, loading } = useFetch(fetcher, []);

  if (loading) return <PageLoader label="Loading your chair…" />;

  const stats = data || {};
  const earnings = stats.monthlyEarnings || {};

  return (
    <div>
      <PageHeader
        eyebrow="Barber"
        title={`Good to see you, ${user.name.split(' ')[0]}`}
        description="Here's today's chair and this month's numbers."
        actions={
          <Link to="/app/barber/schedule" className="btn-primary">
            View schedule <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's visits" value={stats.todayAppointments?.length || 0} icon={CalendarClock} tone="emerald" />
        <StatCard label="Month earnings" value={formatCurrency(earnings.totalEarnings)} icon={Wallet} tone="brass" />
        <StatCard label="Commission rate" value={`${stats.commissionRate || 0}%`} icon={Percent} tone="stone" />
        <StatCard label="Total completed" value={stats.totalCompleted || 0} icon={CheckCircle2} tone="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Today's schedule</h3>
          {stats.todayAppointments?.length ? (
            <ul className="space-y-3">
              {stats.todayAppointments.map((a) => (
                <li key={a._id} className="flex items-center justify-between rounded-md border border-ink-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{formatTime(a.timeSlot)} · {a.service?.name}</p>
                    <p className="text-xs text-ink-400">{a.customer?.name} · {a.customer?.phone}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarClock} title="No visits today" description="Enjoy the quiet — check back tomorrow." />
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-800">Coming up</h3>
            <Link to="/app/barber/schedule" className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {stats.upcomingAppointments?.length ? (
            <ul className="space-y-3">
              {stats.upcomingAppointments.map((a) => (
                <li key={a._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{a.service?.name}</p>
                    <p className="text-xs text-ink-400">{a.customer?.name} · {formatDateShort(a.date)} at {formatTime(a.timeSlot)}</p>
                  </div>
                  <span className="num font-semibold text-ink-700">{formatCurrency(a.service?.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-400">Nothing else booked yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
