import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { servicesApi } from '../../../api/services.api';
import Modal from '../../../components/ui/Modal';
import TextField from '../../../components/ui/TextField';
import Select from '../../../components/ui/Select';
import { SERVICE_CATEGORIES } from '../../../utils/constants';

const defaults = { name: '', category: 'Haircut', price: '', duration: '', description: '', isActive: true };

export default function ServiceFormModal({ open, onClose, service, onSaved }) {
  const isEdit = Boolean(service);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (open) reset(service || defaults);
  }, [open, service, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = { ...values, price: Number(values.price), duration: Number(values.duration) };
      if (isEdit) {
        await servicesApi.update(service._id, payload);
        toast.success('Service updated');
      } else {
        await servicesApi.create(payload);
        toast.success('Service created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit service' : 'New service'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField label="Service name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <Select label="Category" {...register('category')}>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Price ($)" type="number" step="0.01" min="0" error={errors.price?.message} {...register('price', { required: 'Required' })} />
          <TextField label="Duration (min)" type="number" min="5" error={errors.duration?.message} {...register('duration', { required: 'Required' })} />
        </div>
        <label className="block">
          <span className="field-label">Description</span>
          <textarea rows={3} className="field" {...register('description')} />
        </label>
        {isEdit && (
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-300" {...register('isActive')} />
            Active in catalog
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create service'}</button>
        </div>
      </form>
    </Modal>
  );
}
