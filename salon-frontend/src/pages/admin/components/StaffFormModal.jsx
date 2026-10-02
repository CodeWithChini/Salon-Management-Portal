import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { staffApi } from '../../../api/staff.api';
import Modal from '../../../components/ui/Modal';
import TextField from '../../../components/ui/TextField';
import Select from '../../../components/ui/Select';
import { SERVICE_CATEGORIES, WEEKDAYS } from '../../../utils/constants';

const emptyDefaults = {
  name: '',
  email: '',
  password: '',
  role: 'Barber',
  phone: '',
  specializations: [],
  experience: 0,
  workingHours: { start: '09:00', end: '18:00' },
  workingDays: [],
  commissionRate: 20,
  isActive: true,
  bio: '',
};

export default function StaffFormModal({ open, onClose, staff, onSaved }) {
  const isEdit = Boolean(staff);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) {
      reset(
        staff
          ? {
              name: staff.name,
              email: staff.email,
              password: '',
              role: staff.role,
              phone: staff.phone || '',
              specializations: staff.specializations || [],
              experience: staff.experience || 0,
              workingHours: staff.workingHours || { start: '09:00', end: '18:00' },
              workingDays: staff.workingDays || [],
              commissionRate: staff.commissionRate || 0,
              isActive: staff.isActive ?? true,
              bio: staff.bio || '',
            }
          : emptyDefaults
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, staff]);

  const role = watch('role');
  const workingDays = watch('workingDays') || [];
  const specializations = watch('specializations') || [];

  const toggleDay = (day) => {
    setValue('workingDays', workingDays.includes(day) ? workingDays.filter((d) => d !== day) : [...workingDays, day]);
  };

  const toggleSpecialization = (cat) => {
    setValue('specializations', specializations.includes(cat) ? specializations.filter((s) => s !== cat) : [...specializations, cat]);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = { ...values };
      if (isEdit) {
        delete payload.email;
        delete payload.password;
        delete payload.role;
        await staffApi.update(staff._id, payload);
        toast.success('Staff member updated');
      } else {
        if (!payload.password) delete payload.password;
        await staffApi.create(payload);
        toast.success('Staff member added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not save staff member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Edit ${staff.name}` : 'Add staff member'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <TextField label="Phone" {...register('phone')} />
        </div>

        {!isEdit && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
            <TextField label="Temporary password" placeholder="default123" {...register('password')} />
          </div>
        )}

        {!isEdit && (
          <Select label="Role" {...register('role')}>
            <option value="Barber">Barber / Stylist</option>
            <option value="Receptionist">Receptionist</option>
          </Select>
        )}

        {role === 'Barber' && (
          <>
            <div>
              <p className="field-label">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleSpecialization(cat)}
                    className={`chip border ${
                      specializations.includes(cat) ? 'border-brass-400 bg-brass-50 text-brass-700' : 'border-ink-200 text-ink-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Experience (years)" type="number" min="0" {...register('experience', { valueAsNumber: true })} />
              <TextField label="Shift start" type="time" {...register('workingHours.start')} />
              <TextField label="Shift end" type="time" {...register('workingHours.end')} />
            </div>

            <div>
              <p className="field-label">Working days</p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`chip border ${
                      workingDays.includes(day) ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-ink-200 text-ink-500'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <TextField
              label="Commission rate (%)"
              type="number"
              min="0"
              max="100"
              {...register('commissionRate', { valueAsNumber: true })}
            />

            <label className="block">
              <span className="field-label">Bio</span>
              <textarea rows={2} className="field" {...register('bio')} />
            </label>
          </>
        )}

        {isEdit && (
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-300" {...register('isActive')} />
            Active on the roster
          </label>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add staff member'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
