import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { productsApi } from '../../../api/products.api';
import Modal from '../../../components/ui/Modal';
import TextField from '../../../components/ui/TextField';
import Select from '../../../components/ui/Select';
import { PRODUCT_CATEGORIES } from '../../../utils/constants';

const defaults = { name: '', category: 'Hair Care', price: '', brand: '', stockQuantity: 0, description: '', isActive: true };

export default function ProductFormModal({ open, onClose, product, onSaved }) {
  const isEdit = Boolean(product);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (open) reset(product || defaults);
  }, [open, product, reset]);

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = { ...values, price: Number(values.price), stockQuantity: Number(values.stockQuantity) };
      if (isEdit) {
        await productsApi.update(product._id, payload);
        toast.success('Product updated');
      } else {
        await productsApi.create(payload);
        toast.success('Product created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit product' : 'New product'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField label="Product name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" {...register('category')}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <TextField label="Brand" {...register('brand')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Price ($)" type="number" step="0.01" min="0" error={errors.price?.message} {...register('price', { required: 'Required' })} />
          <TextField label="Stock quantity" type="number" min="0" {...register('stockQuantity')} />
        </div>
        <label className="block">
          <span className="field-label">Description</span>
          <textarea rows={3} className="field" {...register('description')} />
        </label>
        {isEdit && (
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-300" {...register('isActive')} />
            Listed in store
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}</button>
        </div>
      </form>
    </Modal>
  );
}
