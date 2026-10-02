import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { inventoryApi } from '../../../api/inventory.api';
import Modal from '../../../components/ui/Modal';
import TextField from '../../../components/ui/TextField';
import Select from '../../../components/ui/Select';
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from '../../../utils/constants';

const defaults = {
  itemName: '',
  category: 'Shampoo',
  currentStock: 0,
  minimumStock: 10,
  unit: 'bottles',
  costPerUnit: '',
  supplier: { name: '', contact: '', email: '' },
};

export default function InventoryFormModal({ open, onClose, item, onSaved }) {
  const isEdit = Boolean(item);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (open) reset(item || defaults);
  }, [open, item, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        currentStock: Number(values.currentStock),
        minimumStock: Number(values.minimumStock),
        costPerUnit: Number(values.costPerUnit),
      };
      if (isEdit) {
        await inventoryApi.update(item._id, payload);
        toast.success('Item updated');
      } else {
        await inventoryApi.create(payload);
        toast.success('Item added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit inventory item' : 'New inventory item'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField label="Item name" error={errors.itemName?.message} {...register('itemName', { required: 'Required' })} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" {...register('category')}>
            {INVENTORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select label="Unit" {...register('unit')}>
            {INVENTORY_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <TextField label="Current stock" type="number" min="0" {...register('currentStock', { required: true })} />
          <TextField label="Minimum stock" type="number" min="0" {...register('minimumStock', { required: true })} />
          <TextField label="Cost / unit ($)" type="number" step="0.01" min="0" {...register('costPerUnit', { required: true })} />
        </div>
        <div>
          <p className="field-label">Supplier</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField placeholder="Name" {...register('supplier.name')} />
            <TextField placeholder="Contact" {...register('supplier.contact')} />
            <TextField placeholder="Email" {...register('supplier.email')} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add item'}</button>
        </div>
      </form>
    </Modal>
  );
}
