import { useCallback, useState } from 'react';
import { Users, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatDateShort } from '../../utils/formatters';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(
    () => usersApi.getAll({ role: 'Customer', search, page, limit: 12 }),
    [search, page]
  );
  const { data, loading, refetch } = useFetch(fetcher, [search, page]);
  const customers = data?.data || [];
  const pagination = data?.pagination;

  const toggleActive = async (u) => {
    try {
      await usersApi.update(u._id, { isActive: !u.isActive });
      toast.success('Updated');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await usersApi.remove(deleteTarget._id);
      toast.success('Customer removed');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not remove');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Customers" description="Every guest account registered on the portal." />

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search customers…"
        className="mb-6 sm:w-72"
      />

      {loading ? (
        <PageLoader label="Loading customers…" />
      ) : !customers.length ? (
        <EmptyState icon={Users} title="No customers found" description="Try a different search." />
      ) : (
        <>
          <Table columns={['Customer', 'Email', 'Phone', 'Joined', 'Status', '']}>
            {customers.map((c) => (
              <tr key={c._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} tone="brass" size="sm" />
                    <span className="text-sm font-medium text-ink-700">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ink-500">{c.email}</td>
                <td className="px-4 py-3 text-sm text-ink-500">{c.phone || '—'}</td>
                <td className="px-4 py-3 text-sm text-ink-500">{formatDateShort(c.createdAt?.split('T')[0])}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`chip ${c.isActive !== false ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-ink-500'}`}
                  >
                    {c.isActive !== false ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-ink-400 hover:text-clay-500" onClick={() => setDeleteTarget(c)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </Table>

          {pagination?.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-ink-400">
              <span>
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
              </span>
              <div className="flex gap-2">
                <button className="btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={14} /> Prev
                </button>
                <button className="btn-outline btn-sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        danger
        title="Remove customer?"
        confirmLabel="Remove"
        message={`This permanently deletes ${deleteTarget?.name}'s account.`}
      />
    </div>
  );
}
