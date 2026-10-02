import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wand2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import TextField from '../../components/ui/TextField';
import Spinner from '../../components/ui/Spinner';
import { loginUser, clearAuthError } from '../../features/auth/authSlice';
import { ROLE_META } from '../../utils/constants';
import { ROLE_TABS } from './roleTabConfig';

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState('Customer');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, user, token } = useSelector((s) => s.auth);
  const activeTab = ROLE_TABS.find((t) => t.role === activeRole);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      const from = location.state?.from?.pathname;
      const home = ROLE_META[user.role]?.home || '/login';
      if (user.role !== activeRole) {
        toast(`You're signed in as ${user.role}, not ${activeRole} — taking you to the right panel.`, { icon: 'ℹ️' });
      }
      navigate(from && from !== '/login' ? from : home, { replace: true });
    }
    
  }, [token, user]);

  const fillDemo = () => {
    setValue('email', activeTab.demo.email);
    setValue('password', activeTab.demo.password);
  };

  const onSubmit = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <AuthLayout>
      <div className="mb-8 lg:hidden">
        <p className="font-display text-lg font-semibold text-ink-800">Marchand &amp; Vance</p>
        <p className="text-xs uppercase tracking-wide text-ink-300">Salon Portal</p>
      </div>

      <h1 className="font-display text-[1.75rem] font-semibold text-ink-800">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-400">Choose how you access the portal, then sign in.</p>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {ROLE_TABS.map((tab) => {
          const isActive = tab.role === activeRole;
          return (
            <button
              key={tab.role}
              type="button"
              onClick={() => setActiveRole(tab.role)}
              className={`flex items-center gap-2.5 rounded-md border px-3 py-3 text-left transition-all ${
                isActive ? `${tab.accent} ring-1` : 'border-ink-100 bg-white text-ink-500 hover:border-ink-200'
              }`}
            >
              <tab.icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="leading-tight">
                <span className="block text-[0.82rem] font-semibold">{tab.role}</span>
                <span className="block text-[0.7rem] opacity-70">{tab.tagline}</span>
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <TextField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        {error && <p className="rounded-md bg-clay-50 px-3 py-2 text-sm text-clay-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner size={16} /> : `Sign in as ${activeRole}`}
        </button>

        <button type="button" onClick={fillDemo} className="btn-ghost btn-sm w-full text-ink-400">
          <Wand2 size={14} />
          Fill demo {activeRole.toLowerCase()} credentials
        </button>
      </form>

          <p className="mt-8 text-center text-s 20m text-ink-400">
        New to the salon?{' '}
        <Link to="/register" className="font-semibold text-ink-800 hover:text-brass-500">
          Create a customer account
        </Link>
      </p>
    </AuthLayout>
  );
}
