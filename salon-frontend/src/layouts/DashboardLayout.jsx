import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { sidebarToggled, sidebarClosed } from '../features/ui/uiSlice';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-stone-100">
      <Sidebar mobileOpen={sidebarOpen} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden" onClick={() => dispatch(sidebarClosed())} />
      )}

      <div className="lg:pl-72">
        <header className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
          <button className="rounded-md p-1.5 text-ink-600 hover:bg-stone-100" onClick={() => dispatch(sidebarToggled())}>
            <Menu size={20} />
          </button>
          <p className="font-display text-sm font-semibold text-ink-800">Saloon</p>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
