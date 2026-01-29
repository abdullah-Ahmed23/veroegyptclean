import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from './i18n';

// Types
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  costPrice?: number;
  compareAtPrice?: number;
  available: boolean;
  stock: number;
  sku: string;
  image_url?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  category: string;
  category_id?: string;
  collection: string;
  collection_id?: string;
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
  backImage?: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  quantity: number;
  stock?: number;
  customDesigns?: any[];
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'wallet' | 'instapay';
  paymentProofUrl?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'delivered' | 'returned';
  items?: OrderItem[];
  customDesign?: CustomDesign;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface CustomDesign {
  id: string;
  orderId?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  baseColor: string;
  size: string;
  notes?: string;
  createdAt: string;
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
      storage: createJSONStorage(() => localStorage),
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

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        // Force LTR globally to prevent layout bugs in complex components
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
        set({ language: lang });
      },

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
