import { initials } from '../../utils/formatters';

const SIZES = {
  sm: 'h-7 w-7 text-[0.65rem]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-base',
};

export default function Avatar({ name, size = 'md', tone = 'ink' }) {
  const toneClasses = {
    ink: 'bg-ink-800 text-stone-50',
    brass: 'bg-brass-400 text-ink-900',
    emerald: 'bg-emerald-500 text-stone-50',
    clay: 'bg-clay-400 text-stone-50',
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]} ${toneClasses[tone]}`}
    >
      {initials(name) || '?'}
    </div>
  );
}
