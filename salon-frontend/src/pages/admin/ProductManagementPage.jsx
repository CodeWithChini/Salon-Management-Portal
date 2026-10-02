import { useCallback, useState } from 'react';
import { ShoppingBag, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProductFormModal from './components/ProductFormModal';
import { formatCurrency } from '../../utils/formatters';

export default function ProductManagementPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(
    () => (search ? productsApi.search(search) : productsApi.getAll({ limit: 50 })),
    [search]
  );
  const { data, loading, refetch } = useFetch(fetcher, [search]);
  const products = data?.data || [];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productsApi.remove(deleteTarget._id);
      toast.success('Product removed');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not remove product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Products"
        description="Manage the retail catalog available in the customer store."
        actions={
          <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={15} /> New product
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="mb-6 sm:w-72" />

      {loading ? (
        <PageLoader label="Loading products…" />
      ) : !products.length ? (
        <EmptyState icon={ShoppingBag} title="No products yet" description="Add your first retail item." />
      ) : (
        <Table columns={['Product', 'Category', 'Brand', 'Price', 'Stock', 'Status', '']}>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-3 text-sm font-medium text-ink-700">{p.name}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{p.category}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{p.brand || '—'}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(p.price)}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{p.stockQuantity}</td>
              <td className="px-4 py-3">
                <span className={`chip ${p.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-ink-500'}`}>
                  {p.isActive ? 'Listed' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-ink-400 hover:text-ink-800" onClick={() => { setEditing(p); setFormOpen(true); }}>
                    <Pencil size={15} />
                  </button>
                  <button className="text-ink-400 hover:text-clay-500" onClick={() => setDeleteTarget(p)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} product={editing} onSaved={refetch} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        danger
        title="Delete product?"
        confirmLabel="Delete"
        message={`This removes "${deleteTarget?.name}" from the store.`}
      />
    </div>
  );
}
