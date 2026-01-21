import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  sku: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  collection: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setPromoCode: (code: string | null) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

interface UIState {
  isDarkMode: boolean;
  language: 'en' | 'ar';
  isSearchOpen: boolean;
  isMegaMenuOpen: boolean;
  heroTheme: 'dark' | 'light';
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setIsMegaMenuOpen: (isOpen: boolean) => void;
  setHeroTheme: (theme: 'dark' | 'light') => void;
}

// Cart Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,

      addItem: (item) => {
        const id = `${item.productId}-${item.variantId}`;
        set((state) => {
          const existingItem = state.items.find((i) => i.id === id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, id }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: null }),

      setIsOpen: (isOpen) => set({ isOpen }),

      setPromoCode: (code) => set({ promoCode: code }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'vero-cart',
    }
  )
);

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: true, // Dark mode default
      language: 'en',
      isSearchOpen: false,
      isMegaMenuOpen: false,

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      setLanguage: (lang) => set({ language: lang }),

      setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

      setIsMegaMenuOpen: (isOpen) => set({ isMegaMenuOpen: isOpen }),

      heroTheme: 'dark', // Default
      setHeroTheme: (theme) => set({ heroTheme: theme }),
    }),
    {
      name: 'vero-ui',
    }
  )
);

// Helper to format price in EGP
export const formatPrice = (price: number, language: 'en' | 'ar' = 'en'): string => {
  const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return language === 'ar' ? `${formatted} ج.م` : `EGP ${formatted}`;
};
