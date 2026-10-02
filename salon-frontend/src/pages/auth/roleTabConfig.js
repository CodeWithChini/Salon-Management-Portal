import { Sparkles, Scissors, ClipboardList, ShieldCheck } from 'lucide-react';

export const ROLE_TABS = [
  {
    role: 'Customer',
    icon: Sparkles,
    tagline: 'Book & shop',
    accent: 'border-brass-400 bg-brass-50 text-brass-700 ring-brass-300',
    demo: { email: 'alex@example.com', password: 'customer123' },
  },
  {
    role: 'Barber',
    icon: Scissors,
    tagline: 'Run my chair',
    accent: 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-emerald-300',
    demo: { email: 'marcus@salon.com', password: 'barber123' },
  },
  {
    role: 'Receptionist',
    icon: ClipboardList,
    tagline: 'Front desk',
    accent: 'border-clay-400 bg-clay-50 text-clay-700 ring-clay-300',
    demo: { email: 'emily@salon.com', password: 'recep123' },
  },
  {
    role: 'Admin',
    icon: ShieldCheck,
    tagline: 'Full oversight',
    accent: 'border-ink-700 bg-ink-50 text-ink-800 ring-ink-400',
    demo: { email: 'admin@salon.com', password: 'admin123' },
  },
];
