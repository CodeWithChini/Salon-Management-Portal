import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Save, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchCurrentUser, updateMyProfile } from '../../features/auth/authSlice';
import { authApi } from '../../api/auth.api';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import TextField from '../../components/ui/TextField';
import Avatar from '../../components/ui/Avatar';
import { ROLE_META } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const meta = ROLE_META[user.role];
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: user.name, phone: user.phone, bio: user.bio, street: '', city: '', state: '', zip: '' } });

  const pwForm = useForm();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reset({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zip: user.address?.zip || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.name, user.phone, user.bio, user.address]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      await dispatch(
        updateMyProfile({
          name: values.name,
          phone: values.phone,
          bio: values.bio,
          address: { street: values.street, city: values.city, state: values.state, zip: values.zip },
        })
      ).unwrap();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success('Password changed');
      pwForm.reset();
    } catch (err) {
      toast.error(err.message || 'Could not change password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow={meta.label} title="Your profile" description="Update your personal details and password." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <Avatar name={user.name} size="xl" tone={meta.accent === 'ink' ? 'ink' : meta.accent} />
            <p className="mt-3 font-display text-lg font-semibold text-ink-800">{user.name}</p>
            <p className="text-sm text-ink-400">{user.email}</p>
            <span className="chip mt-3 inline-flex bg-stone-100 text-ink-600">{user.role}</span>
            {user.createdAt && (
              <p className="mt-4 text-xs text-ink-300">Member since {formatDate(user.createdAt.split('T')[0])}</p>
            )}
          </Card>

          {user.role === 'Barber' && (
            <Card className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Chair details</p>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-400">Specializations</dt>
                  <dd className="text-right font-medium text-ink-700">
                    {(user.specializations || []).join(', ') || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Experience</dt>
                  <dd className="font-medium text-ink-700">{user.experience || 0} yrs</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Working hours</dt>
                  <dd className="font-medium text-ink-700">
                    {user.workingHours ? `${user.workingHours.start}–${user.workingHours.end}` : '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Working days</dt>
                  <dd className="max-w-[60%] text-right font-medium text-ink-700">
                    {(user.workingDays || []).join(', ') || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Commission rate</dt>
                  <dd className="font-medium text-ink-700">{user.commissionRate || 0}%</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-ink-300">
                Working hours, days, and commission are set by an administrator.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Personal details</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
                <TextField label="Phone" {...register('phone')} />
              </div>
              {(user.role === 'Barber' || user.role === 'Receptionist' || user.role === 'Admin') && (
                <label className="block">
                  <span className="field-label">Bio</span>
                  <textarea rows={3} className="field" {...register('bio')} />
                </label>
              )}
              <div>
                <p className="field-label">Address</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField placeholder="Street" {...register('street')} />
                  <TextField placeholder="City" {...register('city')} />
                  <TextField placeholder="State" {...register('state')} />
                  <TextField placeholder="ZIP" {...register('zip')} />
                </div>
              </div>
              <button className="btn-primary" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-ink-800">
              <KeyRound size={16} className="text-ink-400" />
              Change password
            </h3>
            <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
              <TextField
                label="Current password"
                type="password"
                error={pwForm.formState.errors.currentPassword?.message}
                {...pwForm.register('currentPassword', { required: 'Required' })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="New password"
                  type="password"
                  error={pwForm.formState.errors.newPassword?.message}
                  {...pwForm.register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  {...pwForm.register('confirmPassword', { required: 'Required' })}
                />
              </div>
              <button className="btn-outline" disabled={pwSaving}>
                {pwSaving ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
