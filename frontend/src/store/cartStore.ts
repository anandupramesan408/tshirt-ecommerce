import { create } from 'zustand';
import { Cart } from '@/types';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (variantId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    try {
      const { data } = await cartApi.get();
      set({ cart: data });
    } catch {}
  },

  addItem: async (variantId, quantity = 1) => {
    set({ loading: true });
    try {
      const { data } = await cartApi.addItem(variantId, quantity);
      set({ cart: data });
      toast.success('Added to cart!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to add item');
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const { data } = await cartApi.updateItem(itemId, quantity);
      set({ cart: data });
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to update item');
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await cartApi.removeItem(itemId);
      set({ cart: data });
      toast.success('Item removed');
    } catch {}
  },

  clearCart: async () => {
    try {
      const { data } = await cartApi.clear();
      set({ cart: data });
    } catch {}
  },
}));
