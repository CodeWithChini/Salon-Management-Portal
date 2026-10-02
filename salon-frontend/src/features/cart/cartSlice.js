import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'salon.cart';

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function recompute(state) {
  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalAmount = Math.round(state.items.reduce((sum, i) => sum + i.quantity * i.price, 0) * 100) / 100;
  persist(state.items);
}

const initialState = {
  items: readCart(),
  totalQuantity: 0,
  totalAmount: 0,
};
recompute(initialState);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded(state, action) {
      const { id, name, price, image, stockQuantity, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      const cap = typeof stockQuantity === 'number' ? stockQuantity : Infinity;
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, cap);
      } else {
        state.items.push({ id, name, price, image, stockQuantity: cap, quantity: Math.min(quantity, cap) });
      }
      recompute(state);
    },
    quantityChanged(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const cap = typeof item.stockQuantity === 'number' ? item.stockQuantity : Infinity;
        item.quantity = Math.max(1, Math.min(quantity, cap));
      }
      recompute(state);
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      recompute(state);
    },
    cartCleared(state) {
      state.items = [];
      recompute(state);
    },
  },
});

export const { itemAdded, quantityChanged, itemRemoved, cartCleared } = cartSlice.actions;
export default cartSlice.reducer;
