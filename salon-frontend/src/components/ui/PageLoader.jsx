import Spinner from './Spinner';

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-400">
      <Spinner size={26} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
