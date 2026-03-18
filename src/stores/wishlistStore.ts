import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  toggleItem: (product: WishlistItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      toggleItem: (product) => {
        const state = get();
        if (state.isInWishlist(product.id)) {
          state.removeItem(product.id);
        } else {
          state.addItem(product);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'ofh-wishlist',
    },
  ),
);

