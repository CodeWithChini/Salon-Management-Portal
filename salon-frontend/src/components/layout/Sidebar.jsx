import { NavLink } from 'react-router-dom';
import { Scissors, LogOut, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { loggedOut } from '../../features/auth/authSlice';
import { sidebarClosed } from '../../features/ui/uiSlice';
import { NAV_CONFIG } from '../../utils/navConfig';
import { ROLE_META } from '../../utils/constants';
import Avatar from '../ui/Avatar';

const ACCENT_ACTIVE = {
  brass: 'bg-brass-400/15 text-brass-600 border-brass-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500',
  clay: 'bg-clay-400/10 text-clay-600 border-clay-400',
  ink: 'bg-ink-800/8 text-ink-800 border-ink-800',
};

const AVATAR_TONE = { brass: 'brass', emerald: 'emerald', clay: 'clay', ink: 'ink' };

export default function Sidebar({ mobileOpen }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const meta = ROLE_META[user.role];
  const items = NAV_CONFIG[user.role] || [];
  const activeCls = ACCENT_ACTIVE[meta.accent];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-100 bg-white transition-transform lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-800 text-brass-300">
            <Scissors size={16} strokeWidth={1.75} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[0.95rem] font-semibold text-ink-800">Saloon</p>
            <p className="text-[0.68rem] uppercase tracking-wide text-ink-300">Salon Portal</p>
          </div>
        </div>
        <button
          className="rounded-md p-1 text-ink-300 hover:text-ink-600 lg:hidden"
          onClick={() => dispatch(sidebarClosed())}
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pt-4">
        <span className={`chip border ${activeCls}`}>{meta.label}</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => dispatch(sidebarClosed())}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? activeCls : 'border-transparent text-ink-500 hover:bg-stone-50 hover:text-ink-800'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar name={user.name} tone={AVATAR_TONE[meta.accent]} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-ink-800">{user.name}</p>
            <p className="truncate text-xs text-ink-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(loggedOut())}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-ink-200 px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:border-clay-300 hover:bg-clay-50 hover:text-clay-600"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
