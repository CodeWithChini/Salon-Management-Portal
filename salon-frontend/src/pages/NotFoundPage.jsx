import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_META } from '../utils/constants';

export default function NotFoundPage() {
  const { user } = useAuth();
  const home = user ? ROLE_META[user.role]?.home : '/login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-ink-800 text-brass-300">
        <Scissors size={22} strokeWidth={1.75} />
      </span>
      <p className="num mt-6 text-sm font-semibold text-brass-500">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-800">This page got a trim</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-400">We couldn't find what you were looking for. Let's get you back on track.</p>
      <Link to={home} className="btn-primary mt-6"> 
        Back to portal
      </Link>
    </div>
  );
}
