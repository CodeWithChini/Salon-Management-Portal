import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products.api';
import { useFetch } from '../../hooks/useFetch';
import { itemAdded } from '../../features/cart/cartSlice';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function StorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const fetcher = useCallback(() => {
    if (search) return productsApi.search(search).then((r) => ({ data: r.data }));
    return productsApi.getAll({ category, sort });
  }, [search, category, sort]);
  const { data, loading } = useFetch(fetcher, [search, category, sort]);
  const products = data?.data || [];

  const handleAdd = (p) => {
    dispatch(itemAdded({ id: p._id, name: p.name, price: p.price, image: p.image, stockQuantity: p.stockQuantity }));
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div>
      <PageHeader eyebrow="Retail" title="Product store" description="Grooming essentials to keep the look going between visits." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="sm:w-72" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
          <option value="">All categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-48">
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
          <option value="rating">Top rated</option>
          <option value="name">Name A–Z</option>
        </Select>
      </div>

      {loading ? (
        <PageLoader label="Loading products…" />
      ) : !products.length ? (
        <EmptyState icon={ShoppingBag} title="No products found" description="Try a different search or category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const inCart = cartItems.find((i) => i.id === p._id);
            const outOfStock = p.stockQuantity <= 0;
            return (
              <Card key={p._id} className="flex flex-col p-5">
                <div className="mb-3 flex h-28 items-center justify-center rounded-md bg-stone-100 text-ink-200">
                  <ShoppingBag size={30} strokeWidth={1.25} />
                </div>
                <p className="text-[0.7rem] uppercase tracking-wide text-ink-300">{p.brand || p.category}</p>
                <p className="font-display text-base font-semibold text-ink-800">{p.name}</p>
                {p.rating > 0 && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-brass-500">
                    <Star size={12} fill="currentColor" /> {p.rating.toFixed(1)} ({p.numReviews})
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="num text-lg font-semibold text-ink-800">{formatCurrency(p.price)}</span>
                  <button
                    onClick={() => handleAdd(p)}
                    disabled={outOfStock}
                    className="btn-brass btn-sm"
                  >
                    <Plus size={13} /> {inCart ? `In cart (${inCart.quantity})` : outOfStock ? 'Sold out' : 'Add'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
