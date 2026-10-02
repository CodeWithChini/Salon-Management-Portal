import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { servicesApi } from '../../api/services.api';
import { useFetch } from '../../hooks/useFetch';
import { serviceSelected, bookingReset } from '../../features/booking/bookingSlice';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatDuration } from '../../utils/formatters';

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetcher = useCallback(() => servicesApi.getAll({ search, category }).then((r) => r.data), [search, category]);
  const { data: services, loading } = useFetch(fetcher, [search, category]);

  const grouped = useMemo(() => {
    const list = services || [];
    return list.reduce((acc, s) => {
      acc[s.category] = acc[s.category] || [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [services]);

  const handleBook = (service) => {
    dispatch(bookingReset());
    dispatch(
      serviceSelected({ id: service._id, name: service.name, price: service.price, duration: service.duration, category: service.category })
    );
    navigate('/app/customer/book');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Book a service"
        description="Pick a treatment, then choose your stylist, date, and time."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search treatments…" className="sm:w-72" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <PageLoader label="Loading services…" />
      ) : !services?.length ? (
        <EmptyState icon={Clock} title="No services match" description="Try a different search or category." />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="mb-3 font-display text-lg font-semibold text-ink-800">{cat}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <Card key={s._id} className="flex flex-col p-5">
                    <p className="font-display text-base font-semibold text-ink-800">{s.name}</p>
                    {s.description && <p className="mt-1 text-xs text-ink-400 line-clamp-2">{s.description}</p>}
                    <div className="mt-3 flex items-center gap-3 text-xs text-ink-400">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {formatDuration(s.duration)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="num text-lg font-semibold text-ink-800">{formatCurrency(s.price)}</span>
                      <button onClick={() => handleBook(s)} className="btn-brass btn-sm">
                        Book <ArrowRight size={13} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
