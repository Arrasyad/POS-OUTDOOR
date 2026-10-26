'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function StoreInitializer() {
  const { resetDateIfEmptyCart, setProducts } = useStore();
  
  useEffect(() => {
    // If the user refreshed the page and cart is empty, clean up the date store.
    resetDateIfEmptyCart();
  }, [resetDateIfEmptyCart]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    }
    fetchProducts();
  }, [setProducts]);

  const { dateRange, isDateLocked, setActiveBookings } = useStore();
  
  useEffect(() => {
    async function fetchBookings() {
      if (isDateLocked && dateRange.from && dateRange.to) {
        const startObj = new Date(dateRange.from);
        const endObj = new Date(dateRange.to);
        const start = startObj.toISOString().split('T')[0];
        const end = endObj.toISOString().split('T')[0];
        try {
          const res = await fetch(`/api/bookings?start=${start}&end=${end}`);
          if (res.ok) {
            const data = await res.json();
            setActiveBookings(data);
          }
        } catch (error) {
          console.error('Failed to fetch active bookings', error);
        }
      }
    }
    fetchBookings();
  }, [isDateLocked, dateRange, setActiveBookings]);

  return null;
}
