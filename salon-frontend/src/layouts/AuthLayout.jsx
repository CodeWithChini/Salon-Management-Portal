import { Scissors } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen bg-stone-100 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-800 px-12 py-12 text-stone-100 lg:flex">
        <div className="absolute inset-0 bg-noise" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #AD8A4E, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: 'radial-gradient(circle, #2C4A3B, transparent 70%)' }}
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brass-400/15 text-brass-300">
            <Scissors size={18} strokeWidth={1.75} />
          </span>
          <span className="font-display text-lg font-semibold">Saloon</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-[2.6rem] font-light leading-[1.15] tracking-tight text-stone-50">
            One chair,<br />one ledger,<br /><span className="italic text-brass-300">four ways in.</span>
          </p>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-200">
            Every booking, blade, and balance sheet in the shop runs through one portal —
            tuned differently for the guest in the chair, the stylist behind it, the desk
            that keeps the day on schedule, and the owner watching it all add up.
          </p>
        </div>

        <div className="relative flex items-center gap-8 border-t border-white/10 pt-6 text-xs text-ink-300">
          <div>
            <p className="num text-xl font-semibold text-stone-50">4</p>
            <p className="mt-0.5">role-tuned panels</p>
          </div>
          <div>
            <p className="num text-xl font-semibold text-stone-50">24/7</p>
            <p className="mt-0.5">booking availability</p>
          </div>
          <div>
            <p className="num text-xl font-semibold text-stone-50">0</p>
            <p className="mt-0.5">paper appointment books</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
