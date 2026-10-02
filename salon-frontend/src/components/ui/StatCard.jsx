export default function StatCard({ label, value, icon: Icon, tone = 'ink', hint }) {
  const toneClasses = {
    ink: 'bg-ink-800 text-stone-50',
    brass: 'bg-brass-400 text-ink-900',
    emerald: 'bg-emerald-500 text-stone-50',
    clay: 'bg-clay-400 text-stone-50',
    stone: 'bg-stone-200 text-ink-700',
  };
  return (
    <div className="card flex items-start justify-between gap-3 p-5">
      <div>
        <p className="text-[0.75rem] font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="num mt-2 text-2xl font-semibold text-ink-800">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${toneClasses[tone]}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}
