import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarClock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffApi } from '../../api/staff.api';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import TextField from '../../components/ui/TextField';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatDate, todayISO } from '../../utils/formatters';

export default function TimeOffPage() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: timeOffs, loading, refetch } = useFetch(() => staffApi.getMyTimeOffs().then((r) => r.data), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await staffApi.requestTimeOff(values);
      toast.success('Time-off request submitted');
      reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Barber"
        title="Time off"
        description="Request leave and track approval status."
        actions={
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus size={15} /> Request time off
          </button>
        }
      />

      {loading ? (
        <PageLoader label="Loading requests…" />
      ) : !timeOffs?.length ? (
        <EmptyState icon={CalendarClock} title="No requests yet" description="Submitted time-off requests will appear here." />
      ) : (
        <div className="space-y-3">
          {timeOffs.map((t) => (
            <Card key={t._id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-ink-800">
                  {formatDate(t.startDate)} — {formatDate(t.endDate)}
                </p>
                {t.reason && <p className="mt-1 text-xs text-ink-400">{t.reason}</p>}
                {t.approvedBy?.name && <p className="mt-1 text-xs text-ink-300">Reviewed by {t.approvedBy.name}</p>}
              </div>
              <StatusBadge status={t.status} />
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Request time off">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Start date"
              type="date"
              min={todayISO()}
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Required' })}
            />
            <TextField
              label="End date"
              type="date"
              min={todayISO()}
              error={errors.endDate?.message}
              {...register('endDate', { required: 'Required' })}
            />
          </div>
          <label className="block">
            <span className="field-label">Reason (optional)</span>
            <textarea rows={3} className="field" {...register('reason')} placeholder="Let the desk know why" />
          </label>
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
