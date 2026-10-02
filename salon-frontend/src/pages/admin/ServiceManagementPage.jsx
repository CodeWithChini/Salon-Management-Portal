import { useCallback, useState } from 'react';
import { Scissors, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesApi } from '../../api/services.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ServiceFormModal from './components/ServiceFormModal';
import { formatCurrency, formatDuration } from '../../utils/formatters';

export default function ServiceManagementPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => servicesApi.getAll({ search, isActive: '' }).then((r) => r.data), [search]);
  const { data: services, loading, refetch } = useFetch(fetcher, [search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await servicesApi.remove(deleteTarget._id);
      toast.success('Service removed');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not remove service');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Services"
        description="Manage the treatment catalog customers can book."
        actions={
          <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={15} /> New service
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search services…" className="mb-6 sm:w-72" />

      {loading ? (
        <PageLoader label="Loading services…" />
      ) : !services?.length ? (
        <EmptyState icon={Scissors} title="No services yet" description="Add your first treatment to the catalog." />
      ) : (
        <Table columns={['Service', 'Category', 'Price', 'Duration', 'Status', '']}>
          {services.map((s) => (
            <tr key={s._id}>
              <td className="px-4 py-3 text-sm font-medium text-ink-700">{s.name}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{s.category}</td>
              <td className="num px-4 py-3 text-sm text-ink-600">{formatCurrency(s.price)}</td>
              <td className="px-4 py-3 text-sm text-ink-500">{formatDuration(s.duration)}</td>
              <td className="px-4 py-3">
                <span className={`chip ${s.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-ink-500'}`}>
                  {s.isActive ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-ink-400 hover:text-ink-800" onClick={() => { setEditing(s); setFormOpen(true); }}>
                    <Pencil size={15} />
                  </button>
                  <button className="text-ink-400 hover:text-clay-500" onClick={() => setDeleteTarget(s)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <ServiceFormModal open={formOpen} onClose={() => setFormOpen(false)} service={editing} onSaved={refetch} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        danger
        title="Delete service?"
        confirmLabel="Delete"
        message={`This removes "${deleteTarget?.name}" from the catalog.`}
      />
    </div>
  );
}
