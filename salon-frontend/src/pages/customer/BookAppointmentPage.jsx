import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, ChevronLeft, ChevronRight, Star, Scissors } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import { appointmentsApi } from '../../api/appointments.api';
import { useFetch } from '../../hooks/useFetch';
import {
  barberSelected,
  dateSelected,
  timeSlotSelected,
  stepAdvanced,
  stepRetreated,
  bookingReset,
} from '../../features/booking/bookingSlice';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import PageLoader from '../../components/ui/PageLoader';
import { formatCurrency, formatDuration, formatDateShort, formatTime, todayISO } from '../../utils/formatters';

const STEPS = ['Stylist', 'Date & time', 'Confirm'];

export default function BookAppointmentPage() {
  const booking = useSelector((s) => s.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [localDate, setLocalDate] = useState(booking.selectedDate || '');

  const barbersFetcher = useCallback(
    () => usersApi.getBarbers(booking.selectedService ? { specialization: booking.selectedService.category } : {}).then((r) => r.data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const { data: barbers, loading: loadingBarbers } = useFetch(barbersFetcher, []);

  const slotsFetcher = useCallback(() => {
    if (!booking.selectedBarber || !localDate) return Promise.resolve([]);
    return appointmentsApi.getAvailableSlots(booking.selectedBarber.id, localDate).then((r) => r.data);
  }, [booking.selectedBarber, localDate]);
  const { data: slots, loading: loadingSlots } = useFetch(slotsFetcher, [booking.selectedBarber?.id, localDate]);

  useEffect(() => {
    if (!booking.selectedService) {
      navigate('/app/customer/services', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booking.selectedService) return null;

  const { selectedService, selectedBarber, selectedTimeSlot, step } = booking;

  const goNext = () => dispatch(stepAdvanced());
  const goBack = () => (step === 0 ? navigate('/app/customer/services') : dispatch(stepRetreated()));

  const handleDateChange = (val) => {
    setLocalDate(val);
    dispatch(dateSelected(val));
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await appointmentsApi.create({
        service: selectedService.id,
        barber: selectedBarber.id,
        date: localDate,
        timeSlot: selectedTimeSlot,
        notes,
      });
      toast.success('Appointment booked!');
      dispatch(bookingReset());
      navigate('/app/customer/appointments');
    } catch (err) {
      toast.error(err.message || 'Could not book this slot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Booking wizard" title={selectedService.name} description="Complete the steps below to reserve your visit." />

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-ink-800 text-white' : 'bg-stone-200 text-ink-400'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${i <= step ? 'text-ink-800' : 'text-ink-300'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`mx-3 h-px flex-1 ${i < step ? 'bg-emerald-400' : 'bg-stone-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          {step === 0 && (
            <div>
              <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Choose your stylist</h3>
              {loadingBarbers ? (
                <PageLoader label="Finding available stylists…" />
              ) : !barbers?.length ? (
                <EmptyState icon={Scissors} title="No stylists available" description="Try another service category." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {barbers.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => dispatch(barberSelected({ id: b._id, name: b.name }))}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                        selectedBarber?.id === b._id ? 'border-brass-400 bg-brass-50/60 ring-1 ring-brass-300' : 'border-ink-100 hover:border-ink-300'
                      }`}
                    >
                      <Avatar name={b.name} tone="brass" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-800">{b.name}</p>
                        <p className="mt-0.5 text-xs text-ink-400">{(b.specializations || []).join(', ') || 'General stylist'}</p>
                        {b.experience > 0 && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-brass-500">
                            <Star size={11} fill="currentColor" /> {b.experience} yrs experience
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Pick a date &amp; time</h3>
              <label className="block max-w-xs">
                <span className="field-label">Date</span>
                <input
                  type="date"
                  min={todayISO()}
                  value={localDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="field"
                />
              </label>

              <div className="mt-5">
                {!localDate ? (
                  <p className="text-sm text-ink-400">Choose a date to see open time slots.</p>
                ) : loadingSlots ? (
                  <PageLoader label="Checking availability…" />
                ) : !slots?.length ? (
                  <EmptyState title="No slots this day" description="This stylist isn't working or fully booked — try another date." />
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => dispatch(timeSlotSelected(s.time))}
                        className={`rounded-md border px-2 py-2 text-sm font-medium transition-colors ${
                          !s.available
                            ? 'cursor-not-allowed border-ink-100 bg-stone-100 text-ink-300 line-through'
                            : selectedTimeSlot === s.time
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
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Confirm your booking</h3>
              <dl className="space-y-3 rounded-lg bg-stone-50 p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-400">Service</dt>
                  <dd className="font-medium text-ink-800">{selectedService.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Stylist</dt>
                  <dd className="font-medium text-ink-800">{selectedBarber.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Date</dt>
                  <dd className="font-medium text-ink-800">{formatDateShort(localDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Time</dt>
                  <dd className="font-medium text-ink-800">{formatTime(selectedTimeSlot)}</dd>
                </div>
              </dl>
              <label className="mt-4 block">
                <span className="field-label">Notes for your stylist (optional)</span>
                <textarea rows={3} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any preferences we should know about?" />
              </label>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-5">
            <button onClick={goBack} className="btn-ghost">
              <ChevronLeft size={16} /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={goNext}
                disabled={(step === 0 && !selectedBarber) || (step === 1 && !selectedTimeSlot)}
                className="btn-primary"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleConfirm} disabled={submitting} className="btn-brass">
                {submitting ? 'Booking…' : 'Confirm appointment'}
              </button>
            )}
          </div>
        </Card>

        <Card className="h-fit p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Order summary</p>
          <p className="font-display text-lg font-semibold text-ink-800">{selectedService.name}</p>
          <p className="text-xs text-ink-400">{selectedService.category} · {formatDuration(selectedService.duration)}</p>
          <div className="my-4 h-px bg-ink-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Total</span>
            <span className="num text-xl font-semibold text-ink-800">{formatCurrency(selectedService.price)}</span>
          </div>
          <Link to="/app/customer/services" className="mt-4 block text-center text-xs font-semibold text-brass-500 hover:text-brass-600">
            Change service
          </Link>
        </Card>
      </div>
    </div>
  );
}
