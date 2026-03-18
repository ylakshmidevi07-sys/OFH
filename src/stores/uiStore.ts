import { create } from 'zustand';

interface UIState {
  isSideMenuOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;

  openSideMenu: () => void;
  closeSideMenu: () => void;
  toggleSideMenu: () => void;

  openWishlist: () => void;
  closeWishlist: () => void;

  openSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSideMenuOpen: false,
  isWishlistOpen: false,
  isSearchOpen: false,

  openSideMenu: () => set({ isSideMenuOpen: true }),
  closeSideMenu: () => set({ isSideMenuOpen: false }),
  toggleSideMenu: () => set((s) => ({ isSideMenuOpen: !s.isSideMenuOpen })),

  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));

