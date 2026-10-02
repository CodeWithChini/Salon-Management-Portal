import { useCallback } from 'react';
import { Wallet, Percent, Scissors } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { wagesApi } from '../../api/wages.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function EarningsPage() {
  const year = new Date().getFullYear();

  const summaryFetcher = useCallback(() => wagesApi.getMonthlySummary({ year }).then((r) => r.data), [year]);
  const { data: summary, loading: loadingSummary } = useFetch(summaryFetcher, [year]);

  const earningsFetcher = useCallback(() => wagesApi.getMyEarnings({ year }), [year]);
  const { data: earnings, loading: loadingEarnings } = useFetch(earningsFetcher, [year]);

  const chartData = MONTH_LABELS.map((label, i) => {
    const match = summary?.find((s) => s._id.month === i + 1);
    return { month: label, earnings: match?.totalEarnings || 0 };
  });

  return (
    <div>
      <PageHeader eyebrow="Barber" title="Earnings" description="Commission, tips, and payout history." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Earnings this year" value={formatCurrency(earnings?.summary?.totalEarnings)} icon={Wallet} tone="brass" />
        <StatCard label="Commission earned" value={formatCurrency(earnings?.summary?.totalCommission)} icon={Percent} tone="emerald" />
        <StatCard label="Services paid out" value={earnings?.summary?.totalServices || 0} icon={Scissors} tone="ink" />
      </div>

      <Card className="mt-6 p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Monthly earnings — {year}</h3>
        {loadingSummary ? (
          <PageLoader label="Loading chart…" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DD" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#7C6F5C' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 6, border: '1px solid #ECE7DD', fontSize: 13 }} />
              <Bar dataKey="earnings" fill="#AD8A4E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="mt-6 p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Wage records</h3>
        {loadingEarnings ? (
          <PageLoader label="Loading records…" />
        ) : !earnings?.data?.length ? (
          <EmptyState icon={Wallet} title="No wage records yet" description="Records appear once completed visits are paid out." />
        ) : (
          <Table columns={['Date', 'Service', 'Amount', 'Commission', 'Tips', 'Total', 'Status']}>
            {earnings.data.map((w) => (
              <tr key={w._id}>
                <td className="px-4 py-3 text-sm text-ink-600">{formatDate(w.date)}</td>
                <td className="px-4 py-3 text-sm text-ink-600">{w.service?.name || '—'}</td>
                <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(w.serviceAmount)}</td>
                <td className="num px-4 py-3 text-sm text-ink-600">
                  {formatCurrency(w.commissionEarned)} <span className="text-ink-300">({w.commissionRate}%)</span>
                </td>
                <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(w.tips)}</td>
                <td className="num px-4 py-3 text-sm font-semibold text-ink-800">{formatCurrency(w.totalEarning)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={w.status} />
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
