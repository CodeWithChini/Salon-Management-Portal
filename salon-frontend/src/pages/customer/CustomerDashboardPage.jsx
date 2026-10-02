import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Wallet, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard.api';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency, formatDateShort, formatTime } from '../../utils/formatters';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const fetcher = useCallback(() => dashboardApi.getCustomer().then((r) => r.data), []);
  const { data, loading } = useFetch(fetcher, []);

  if (loading) return <PageLoader label="Loading your dashboard…" />;

  const stats = data || {};

  return (
    <div>
      <PageHeader
        eyebrow="Customer"
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        description="Here's what's on the books for you."
        actions={
          <Link to="/app/customer/services" className="btn-brass">
            <Sparkles size={15} />
            Book a service
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming visits" value={stats.upcomingAppointments?.length || 0} icon={CalendarCheck} tone="brass" />
        <StatCard label="Visits completed" value={stats.totalAppointments || 0} icon={Clock} tone="ink" />
        <StatCard label="Total spent" value={formatCurrency(stats.totalSpent)} icon={Wallet} tone="emerald" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-800">Upcoming appointments</h3>
            <Link to="/app/customer/appointments" className="flex items-center gap-1 text-xs font-semibold text-brass-500 hover:text-brass-600">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {stats.upcomingAppointments?.length ? (
            <ul className="space-y-3">
              {stats.upcomingAppointments.map((a) => (
                <li key={a._id} className="flex items-center justify-between rounded-md border border-ink-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{a.service?.name}</p>
                    <p className="text-xs text-ink-400">
                      with {a.barber?.name} · {formatDateShort(a.date)} at {formatTime(a.timeSlot)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={CalendarCheck}
              title="Nothing on the calendar yet"
              description="Browse services and book your next visit."
              action={
                <Link to="/app/customer/services" className="btn-primary btn-sm">
                  Browse services
                </Link>
              }
            />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Your favorites</h3>
          {stats.favoriteServices?.length ? (
            <ul className="space-y-3">
              {stats.favoriteServices.map((s, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{s.name}</p>
                    <p className="text-xs text-ink-400">{s.bookings} visits · {s.category}</p>
                  </div>
                  <span className="num font-semibold text-ink-700">{formatCurrency(s.price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-400">Book a few visits and your favorites will show up here.</p>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink-800">Recent orders</h3>
          <Link to="/app/customer/orders" className="flex items-center gap-1 text-xs font-semibold text-brass-500 hover:text-brass-600">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {stats.recentOrders?.length ? (
          <ul className="divide-y divide-ink-100">
            {stats.recentOrders.map((o) => (
              <li key={o._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink-700">{o.items?.length} item(s)</p>
                  <p className="text-xs text-ink-400">Order #{o._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="num font-semibold text-ink-700">{formatCurrency(o.totalAmount)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-400">No orders yet — the product store has grooming essentials worth a look.</p>
        )}
      </Card>
    </div>
  );
}
