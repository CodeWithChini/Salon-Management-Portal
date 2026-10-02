import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { quantityChanged, itemRemoved, cartCleared } from '../../features/cart/cartSlice';
import { ordersApi } from '../../api/orders.api';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import TextField from '../../components/ui/TextField';
import Select from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatters';

export default function CartPage() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });

  const tax = Math.round(totalAmount * 0.08 * 100) / 100;
  const grandTotal = Math.round((totalAmount + tax) * 100) / 100;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ product: i.id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
      });
      toast.success('Order placed!');
      dispatch(cartCleared());
      navigate('/app/customer/orders');
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!items.length) {
    return (
      <div>
        <PageHeader eyebrow="Retail" title="Your cart" />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add products from the store to see them here."
          action={
            <Link to="/app/customer/store" className="btn-primary btn-sm">
              Go to store
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Retail" title="Your cart" description={`${items.length} item(s) in your cart`} />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="divide-y divide-ink-100 p-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-stone-100 text-ink-200">
                <ShoppingCart size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                <p className="num text-xs text-ink-400">{formatCurrency(item.price)} each</p>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-ink-200">
                <button
                  className="p-2 text-ink-500 hover:text-ink-800"
                  onClick={() => dispatch(quantityChanged({ id: item.id, quantity: item.quantity - 1 }))}
                >
                  <Minus size={13} />
                </button>
                <span className="num w-6 text-center text-sm">{item.quantity}</span>
                <button
                  className="p-2 text-ink-500 hover:text-ink-800"
                  onClick={() => dispatch(quantityChanged({ id: item.id, quantity: item.quantity + 1 }))}
                >
                  <Plus size={13} />
                </button>
              </div>
              <span className="num w-20 text-right text-sm font-semibold text-ink-800">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <button className="p-2 text-ink-300 hover:text-clay-500" onClick={() => dispatch(itemRemoved(item.id))}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </Card>

        <Card className="h-fit p-6">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-800">Checkout</h3>

          <div className="mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <TextField placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <TextField placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <TextField placeholder="ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
            </div>
            <Select label="Payment method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Card</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Online</option>
            </Select>
          </div>

          <div className="space-y-2 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal</span>
              <span className="num">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>Tax (8%)</span>
              <span className="num">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink-800">
              <span>Total</span>
              <span className="num">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <button className="btn-brass mt-5 w-full" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing order…' : 'Place order'}
          </button>
        </Card>
      </div>
    </div>
  );
}
