import { useCallback } from 'react';
import {
  Users,
  UserCog,
  CalendarRange,
  Clock3,
  Wallet,
  Package,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { analyticsApi } from '../../api/analytics.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency } from '../../utils/formatters';

const year = new Date().getFullYear();

export default function AdminOverviewPage() {
  const { data: overview, loading: loadingOverview } = useFetch(
    useCallback(() => analyticsApi.getOverview().then((r) => r.data), []),
    []
  );
  const { data: revenue, loading: loadingRevenue } = useFetch(
    useCallback(() => analyticsApi.getRevenue({ year }).then((r) => r.data), []),
    []
  );
  const { data: appts, loading: loadingAppts } = useFetch(
    useCallback(() => analyticsApi.getMonthlyAppointments({ year }).then((r) => r.data), []),
    []
  );
  const { data: popularity, loading: loadingPopularity } = useFetch(
    useCallback(() => analyticsApi.getServicePopularity().then((r) => r.data), []),
    []
  );
  const { data: performance, loading: loadingPerformance } = useFetch(
    useCallback(() => analyticsApi.getStaffPerformance().then((r) => r.data), []),
    []
  );

  if (loadingOverview) return <PageLoader label="Crunching the numbers…" />;

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Business overview" description="Revenue, bookings, and staff performance across the salon." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatCurrency(overview?.totalRevenue)} icon={Wallet} tone="brass" />
        <StatCard label="Customers" value={overview?.totalCustomers ?? 0} icon={Users} tone="ink" />
        <StatCard label="Staff" value={overview?.totalStaff ?? 0} icon={UserCog} tone="emerald" />
        <StatCard label="Active services" value={overview?.activeServices ?? 0} icon={Sparkles} tone="clay" />
        <StatCard label="Appointments today" value={overview?.todayAppointments ?? 0} icon={CalendarRange} tone="stone" />
        <StatCard label="Pending appointments" value={overview?.pendingAppointments ?? 0} icon={Clock3} tone="stone" />
        <StatCard label="Total appointments" value={overview?.totalAppointments ?? 0} icon={CalendarRange} tone="stone" />
        <StatCard label="Product orders" value={overview?.totalOrders ?? 0} icon={Package} tone="stone" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Revenue — {year}</h3>
          {loadingRevenue ? (
            <PageLoader label="Loading revenue…" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenue?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DD" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 6, border: '1px solid #ECE7DD', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="appointmentRevenue" name="Services" stroke="#AD8A4E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orderRevenue" name="Retail" stroke="#2C4A3B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Appointments by outcome — {year}</h3>
          {loadingAppts ? (
            <PageLoader label="Loading appointments…" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={appts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DD" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #ECE7DD', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#2C4A3B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#AD8A4E" />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#AC5240" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Most popular services</h3>
          {loadingPopularity ? (
            <PageLoader label="Loading services…" />
          ) : !popularity?.serviceStats?.length ? (
            <p className="text-sm text-ink-400">No completed appointments yet.</p>
          ) : (
            <ul className="space-y-3">
              {popularity.serviceStats.slice(0, 6).map((s, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{s.serviceName}</p>
                    <p className="text-xs text-ink-400">{s.category} · {s.bookings} bookings</p>
                  </div>
                  <span className="num font-semibold text-ink-700">{formatCurrency(s.totalRevenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy size={17} className="text-brass-500" />
            <h3 className="font-display text-base font-semibold text-ink-800">Staff performance this month</h3>
          </div>
          {loadingPerformance ? (
            <PageLoader label="Loading performance…" />
          ) : !performance?.length ? (
            <p className="text-sm text-ink-400">No completed appointments this month yet.</p>
          ) : (
            <ul className="space-y-3">
              {performance.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-700">{p.barberName}</p>
                    <p className="text-xs text-ink-400">{p.completedAppointments} completed · {p.commissionRate}% commission</p>
                  </div>
                  <span className="num font-semibold text-ink-700">{formatCurrency(p.commissionEarned)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
