import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import TextField from '../../components/ui/TextField';
import Spinner from '../../components/ui/Spinner';
import { registerUser, clearAuthError } from '../../features/auth/authSlice';
import { ROLE_META } from '../../utils/constants';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user, token } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      navigate(ROLE_META[user.role]?.home || '/app/customer', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const onSubmit = ({ confirmPassword: _confirmPassword, ...values }) => {
    dispatch(registerUser({ ...values, role: 'Customer' }));
  };

  return (
    <AuthLayout>
      <div className="mb-8 lg:hidden">
        <p className="font-display text-lg font-semibold text-ink-800">Marchand &amp; Vance</p>
        <p className="text-xs uppercase tracking-wide text-ink-300">Salon Portal</p>
      </div>

      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brass-50 px-2.5 py-1 text-[0.72rem] font-semibold text-brass-600">
        <Sparkles size={12} />
        Customer account
      </div>
      <h1 className="font-display text-[1.75rem] font-semibold text-ink-800">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-400">
        Book appointments and shop products. Staff accounts are set up by an administrator.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <TextField
          label="Full name"
          placeholder="Jordan Blake"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <TextField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <TextField
          label="Phone number"
          type="tel"
          placeholder="9876543210"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Use at least 6 characters' },
          })}
        />
        <TextField
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === watch('password') || 'Passwords do not match',
          })}
        />

        {error && <p className="rounded-md bg-clay-50 px-3 py-2 text-sm text-clay-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner size={16} /> : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-ink-800 hover:text-brass-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
