import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface SavedForLaterState {
  items: SavedItem[];
  addItem: (product: SavedItem) => void;
  removeItem: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  clearSavedItems: () => void;
}

export const useSavedForLaterStore = create<SavedForLaterState>()(
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

      isItemSaved: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearSavedItems: () => set({ items: [] }),
    }),
    {
      name: 'ofh-saved-for-later',
    },
  ),
);

