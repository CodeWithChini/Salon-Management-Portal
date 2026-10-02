import { useCallback, useState } from 'react';
import { Boxes, Plus, Pencil, Trash2, PackagePlus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { inventoryApi } from '../../api/inventory.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import TextField from '../../components/ui/TextField';
import InventoryFormModal from './components/InventoryFormModal';
import { INVENTORY_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function InventoryManagementPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [restocking, setRestocking] = useState(false);

  const fetcher = useCallback(() => {
    const params = { ...(search && { search }), ...(category && { category }), ...(lowOnly && { isLowStock: 'true' }) };
    return inventoryApi.getAll(params).then((r) => r.data);
  }, [search, category, lowOnly]);
  const { data: items, loading, refetch } = useFetch(fetcher, [search, category, lowOnly]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await inventoryApi.remove(deleteTarget._id);
      toast.success('Item removed');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    } finally {
      setDeleting(false);
    }
  };

  const handleRestock = async () => {
    setRestocking(true);
    try {
      await inventoryApi.restock(restockTarget._id, Number(restockQty));
      toast.success('Stock updated');
      setRestockTarget(null);
      setRestockQty('');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not restock');
    } finally {
      setRestocking(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Inventory"
        description="Track stock levels for supplies used in the chair."
        actions={
          <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={15} /> New item
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items…" className="sm:w-64" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-48">
          <option value="">All categories</option>
          {INVENTORY_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <button
          onClick={() => setLowOnly((v) => !v)}
          className={`chip border ${lowOnly ? 'border-clay-400 bg-clay-50 text-clay-600' : 'border-ink-200 text-ink-500'}`}
        >
          <AlertTriangle size={12} /> Low stock only
        </button>
      </div>

      {loading ? (
        <PageLoader label="Loading inventory…" />
      ) : !items?.length ? (
        <EmptyState icon={Boxes} title="No items yet" description="Add supplies to start tracking stock." />
      ) : (
        <Table columns={['Item', 'Category', 'Stock', 'Cost / unit', 'Supplier', '']}>
          {items.map((it) => (
            <tr key={it._id} className={it.isLowStock ? 'bg-clay-50/40' : ''}>
              <td className="px-4 py-3 text-sm font-medium text-ink-700">{it.itemName}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{it.category}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`num font-semibold ${it.isLowStock ? 'text-clay-600' : 'text-ink-700'}`}>
                  {it.currentStock} {it.unit}
                </span>
                <span className="ml-1.5 text-xs text-ink-300">/ min {it.minimumStock}</span>
                {it.isLowStock && <span className="chip ml-2 bg-clay-100 text-clay-600">Low</span>}
              </td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(it.costPerUnit)}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{it.supplier?.name || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-ink-400 hover:text-emerald-600" title="Restock" onClick={() => setRestockTarget(it)}>
                    <PackagePlus size={15} />
                  </button>
                  <button className="text-ink-400 hover:text-ink-800" onClick={() => { setEditing(it); setFormOpen(true); }}>
                    <Pencil size={15} />
                  </button>
                  <button className="text-ink-400 hover:text-clay-500" onClick={() => setDeleteTarget(it)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <InventoryFormModal open={formOpen} onClose={() => setFormOpen(false)} item={editing} onSaved={refetch} />

      <Modal
        open={Boolean(restockTarget)}
        onClose={() => setRestockTarget(null)}
        title={`Restock ${restockTarget?.itemName}`}
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setRestockTarget(null)}>Cancel</button>
            <button className="btn-primary btn-sm" disabled={!restockQty || restocking} onClick={handleRestock}>
              {restocking ? 'Saving…' : 'Add stock'}
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ink-500">
          Currently at <strong>{restockTarget?.currentStock} {restockTarget?.unit}</strong>.
        </p>
        <TextField label="Quantity to add" type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        danger
        title="Delete item?"
        confirmLabel="Delete"
        message={`This removes "${deleteTarget?.itemName}" from inventory.`}
      />
    </div>
  );
}
