import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/productsMock';

export interface CartItem {
  productId: string;
  quantity: number;
}
export interface ActiveBooking {
  id: string;
  startDate: string;
  endDate: string;
  items: { productId: string; quantity: number }[];
}

interface AppState {
  products: Product[];
  activeBookings: ActiveBooking[];
  cart: CartItem[];
  dateRange: { from: Date | undefined; to: Date | undefined };
  nightCount: number;
  isDateLocked: boolean;
  userData: { fullName: string; whatsappNumber: string } | null;
  bookingStatus: 'idle' | 'locked' | 'paid' | 'cancelled';
  bookingLockExpiresAt: number | null;
  bookingCode: string | null;
  paymentPhase: 'payment' | 'receipt';
  paymentMethod: 'LUNAS' | 'DP';
  formDraft: { fullName: string; whatsappNumber: string; notes: string; agreeTerms: boolean };
  
  // Actions
  setProducts: (products: Product[]) => void;
  setActiveBookings: (bookings: ActiveBooking[]) => void;
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  lockDate: () => void;
  unlockDate: () => void;
  resetDateIfEmptyCart: () => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUserData: (data: { fullName: string; whatsappNumber: string } | null) => void;
  setBookingStatus: (status: 'idle' | 'locked' | 'paid' | 'cancelled') => void;
  setBookingLockExpiresAt: (expiresAt: number | null) => void;
  startBookingLock: () => void;
  resetBookingState: () => void;
  setFormDraft: (draft: Partial<{ fullName: string; whatsappNumber: string; notes: string; agreeTerms: boolean }>) => void;
  setBookingCode: (code: string | null) => void;
  setPaymentPhase: (phase: 'payment' | 'receipt') => void;
  setPaymentMethod: (method: 'LUNAS' | 'DP') => void;
  confirmPayment: () => void;
  finishTransaction: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: [],
      activeBookings: [],
      cart: [],
      dateRange: { from: undefined, to: undefined },
      nightCount: 1,
      isDateLocked: false,
      userData: null,
      bookingStatus: 'idle',
      bookingLockExpiresAt: null,
      bookingCode: null,
      paymentPhase: 'payment',
      paymentMethod: 'LUNAS',
      formDraft: { fullName: '', whatsappNumber: '', notes: '', agreeTerms: false },

      setProducts: (products) => set({ products }),
      setActiveBookings: (bookings) => set({ activeBookings: bookings }),

      setDateRange: (range) => {
        let nights = 1;
        if (range.from && range.to) {
          const diffTime = Math.abs(new Date(range.to).getTime() - new Date(range.from).getTime());
          nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (nights < 1) nights = 1;
        }
        set({ dateRange: range, nightCount: nights });
      },
      lockDate: () => set({ isDateLocked: true }),
      unlockDate: () => set({ isDateLocked: false }),
      resetDateIfEmptyCart: () => {
        const state = get();
        if (state.cart.length === 0) {
          set({ 
            dateRange: { from: undefined, to: undefined }, 
            nightCount: 1, 
            isDateLocked: false,
            userData: null,
            bookingStatus: 'idle',
            bookingLockExpiresAt: null
          });
        }
      },
      addToCart: (productId) => set((state) => {
        const existing = state.cart.find(item => item.productId === productId);
        if (existing) {
          return { cart: state.cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { productId, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => {
        const newCart = state.cart.filter(item => item.productId !== productId);
        if (newCart.length === 0) {
          return {
            cart: [],
            bookingStatus: 'idle',
            bookingLockExpiresAt: null,
            bookingCode: null,
          };
        }
        return { cart: newCart };
      }),
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          const newCart = state.cart.filter(item => item.productId !== productId);
          if (newCart.length === 0) {
            return {
              cart: [],
              bookingStatus: 'idle',
              bookingLockExpiresAt: null,
              bookingCode: null,
            };
          }
          return { cart: newCart };
        }
        return { cart: state.cart.map(item => item.productId === productId ? { ...item, quantity } : item) };
      }),
      clearCart: () => set({ 
        cart: [],
        bookingStatus: 'idle',
        bookingLockExpiresAt: null,
        bookingCode: null,
        paymentPhase: 'payment',
      }),
      
      setUserData: (data) => set({ userData: data }),
      setBookingStatus: (status) => set({ bookingStatus: status }),
      setBookingLockExpiresAt: (expiresAt) => set({ bookingLockExpiresAt: expiresAt }),
      
      startBookingLock: () => {
        const currentExpires = get().bookingLockExpiresAt;
        // Only set if not already set, or if it has expired
        if (!currentExpires || currentExpires < Date.now()) {
          set({
            bookingLockExpiresAt: Date.now() + 15* 60 * 1000, // 20 seconds for testing
            bookingStatus: 'locked'
          });
        } else {
          // Keep the existing lock going
          set({ bookingStatus: 'locked' });
        }
      },
      
      resetBookingState: () => {
        set({
          userData: null,
          bookingStatus: 'idle',
          bookingLockExpiresAt: null,
          bookingCode: null,
          paymentPhase: 'payment',
          // Clear form draft when session expires, so user starts fresh
          formDraft: { fullName: '', whatsappNumber: '', notes: '', agreeTerms: false },
        });
      },

      setFormDraft: (draft) => set((state) => ({
        formDraft: { ...state.formDraft, ...draft },
      })),

      setBookingCode: (code) => set({ bookingCode: code }),
      setPaymentPhase: (phase) => set({ paymentPhase: phase }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      confirmPayment: async () => {
        const state = get();
        try {
          const subtotal = state.cart.reduce((sum, item) => {
            const product = state.products.find(p => p.id === item.productId);
            if (!product) return sum;
            return sum + product.pricePerNight * item.quantity * state.nightCount;
          }, 0);

          const payload = {
            userData: state.userData,
            startDate: state.dateRange.from ? new Date(state.dateRange.from).toISOString().split('T')[0] : undefined,
            endDate: state.dateRange.to ? new Date(state.dateRange.to).toISOString().split('T')[0] : undefined,
            nightCount: state.nightCount,
            totalPrice: subtotal,
            paymentMethod: state.paymentMethod,
            notes: state.formDraft.notes,
            items: state.cart.map(item => {
              const product = state.products.find(p => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                pricePerNight: product?.pricePerNight || 0
              }
            })
          };

          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error('Payment simulation failed');
          const data = await res.json();

          set({
            bookingCode: data.bookingCode,
            bookingStatus: 'paid',
            paymentPhase: 'receipt',
          });
        } catch (error) {
          console.error(error);
          alert('Gagal memproses pembayaran. Coba lagi.');
        }
      },
      finishTransaction: () => {
        set({
          cart: [],
          dateRange: { from: undefined, to: undefined },
          nightCount: 1,
          isDateLocked: false,
          userData: null,
          bookingStatus: 'idle',
          bookingLockExpiresAt: null,
          bookingCode: null,
          paymentPhase: 'payment',
          paymentMethod: 'LUNAS',
          formDraft: { fullName: '', whatsappNumber: '', notes: '', agreeTerms: false },
        });
      }
    }),
    {
      name: 'pos-outdoor-storage',
    }
  )
);

