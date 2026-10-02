import { STATUS_STYLES } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-stone-200 text-ink-600';
  return <span className={`chip ${cls}`}>{status}</span>;
}
