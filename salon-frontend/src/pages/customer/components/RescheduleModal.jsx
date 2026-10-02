import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { appointmentsApi } from '../../../api/appointments.api';
import { useFetch } from '../../../hooks/useFetch';
import Modal from '../../../components/ui/Modal';
import PageLoader from '../../../components/ui/PageLoader';
import EmptyState from '../../../components/ui/EmptyState';
import { formatTime, todayISO } from '../../../utils/formatters';

export default function RescheduleModal({ appointment, onClose, onDone }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);

  const slotsFetcher = useCallback(() => {
    if (!appointment || !date) return Promise.resolve([]);
    return appointmentsApi.getAvailableSlots(appointment.barber._id, date).then((r) => r.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment?.barber?._id, date]);
  const { data: slots, loading } = useFetch(slotsFetcher, [appointment?._id, date]);

  if (!appointment) return null;

  const handleClose = () => {
    setDate('');
    setTime('');
    onClose();
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await appointmentsApi.reschedule(appointment._id, { date, timeSlot: time });
      toast.success('Appointment rescheduled');
      onDone();
      handleClose();
    } catch (err) {
      toast.error(err.message || 'Could not reschedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={handleClose}
      title={`Reschedule with ${appointment.barber?.name}`}
      footer={
        <>
          <button className="btn-ghost btn-sm" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-primary btn-sm" disabled={!date || !time || saving} onClick={handleSubmit}>
            {saving ? 'Saving…' : 'Confirm new time'}
          </button>
        </>
      }
    >
      <label className="block">
        <span className="field-label">New date</span>
        <input
          type="date"
          min={todayISO()}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime('');
          }}
          className="field"
        />
      </label>

      <div className="mt-4">
        {!date ? (
          <p className="text-sm text-ink-400">Choose a date to see open time slots.</p>
        ) : loading ? (
          <PageLoader label="Checking availability…" />
        ) : !slots?.length ? (
          <EmptyState title="No slots this day" description="Try another date." />
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((s) => (
              <button
                key={s.time}
                disabled={!s.available}
                onClick={() => setTime(s.time)}
                className={`rounded-md border px-2 py-2 text-sm font-medium ${
                  !s.available
                    ? 'cursor-not-allowed border-ink-100 bg-stone-100 text-ink-300 line-through'
                    : time === s.time
                    ? 'border-ink-800 bg-ink-800 text-white'
                    : 'border-ink-200 text-ink-700 hover:border-brass-400'
                }`}
              >
                {formatTime(s.time)}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
