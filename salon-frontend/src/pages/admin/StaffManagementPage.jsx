import { useCallback, useState } from 'react';
import { UserCog, Plus, Pencil, Trash2, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import TimeOffApprovalsPage from '../shared/TimeOffApprovalsPage';
import StaffFormModal from './components/StaffFormModal';

const TABS = [
  { value: 'staff', label: 'Staff roster' },
  { value: 'timeoff', label: 'Time-off requests' },
];

export default function StaffManagementPage() {
  const [tab, setTab] = useState('staff');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(() => staffApi.getAll(search ? { search } : {}).then((r) => r.data), [search]);
  const { data: staff, loading, refetch } = useFetch(fetcher, [search]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (member) => {
    setEditing(member);
    setFormOpen(true);
  };

  const toggleActive = async (member) => {
    try {
      await staffApi.update(member._id, { isActive: !member.isActive });
      toast.success(member.isActive ? 'Marked inactive' : 'Marked active');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not update');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await staffApi.remove(deleteTarget._id);
      toast.success('Removed from roster');
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
      <PageHeader
        eyebrow="Admin"
        title="Staff"
        description="Manage barbers and receptionists, shifts, and leave."
        actions={
          tab === 'staff' && (
            <button className="btn-primary" onClick={openCreate}>
              <Plus size={15} /> Add staff member
            </button>
          )
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'timeoff' ? (
          <TimeOffApprovalsPage />
        ) : (
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search staff…" className="mb-6 sm:w-72" />

            {loading ? (
              <PageLoader label="Loading staff…" />
            ) : !staff?.length ? (
              <EmptyState icon={UserCog} title="No staff yet" description="Add your first barber or receptionist." />
            ) : (
              <Table columns={['Name', 'Role', 'Specializations', 'Commission', 'Status', '']}>
                {staff.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} tone={s.role === 'Barber' ? 'emerald' : 'clay'} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-ink-700">{s.name}</p>
                          <p className="text-xs text-ink-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-600">{s.role}</td>
                    <td className="px-4 py-3 text-sm text-ink-500">{(s.specializations || []).join(', ') || '—'}</td>
                    <td className="num px-4 py-3 text-sm text-ink-600">{s.role === 'Barber' ? `${s.commissionRate}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`chip ${s.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-ink-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-ink-400 hover:text-ink-800" onClick={() => toggleActive(s)} title="Toggle active">
                          <Power size={15} />
                        </button>
                        <button className="text-ink-400 hover:text-ink-800" onClick={() => openEdit(s)} title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="text-ink-400 hover:text-clay-500" onClick={() => setDeleteTarget(s)} title="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </>
        )}
      </div>

      <StaffFormModal open={formOpen} onClose={() => setFormOpen(false)} staff={editing} onSaved={refetch} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        danger
        title="Remove staff member?"
        confirmLabel="Remove"
        message={`This permanently removes ${deleteTarget?.name} from the roster.`}
      />
    </div>
  );
}
